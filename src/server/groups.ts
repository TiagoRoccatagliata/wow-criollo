import "server-only";
import { db } from "./db";
import {
  createToken,
  enforceRateLimit,
  hashSecret,
  UserError,
  verifyToken,
} from "./security";
import {
  idSchema,
  postSchema,
  reportSchema,
  type GroupFilters,
} from "@/features/groups/schema";
import {
  buildGroupWhere,
  canTransition,
  effectiveStatus,
  POST_LIFETIME_MS,
} from "@/features/groups/logic";
import type { Prisma } from "@/generated/prisma/client";

export const publicPostSelect = {
  id: true,
  characterName: true,
  level: true,
  characterClass: true,
  faction: true,
  activity: true,
  zone: true,
  recommendedLevel: true,
  schedule: true,
  availability: true,
  description: true,
  playersNeeded: true,
  status: true,
  createdAt: true,
  expiresAt: true,
  isDemo: true,
} satisfies Prisma.GroupPostSelect;
export type PublicPost = Prisma.GroupPostGetPayload<{
  select: typeof publicPostSelect;
}>;
async function ensureNoActiveDuplicate(
  tx: Prisma.TransactionClient,
  fields: Pick<PublicPost, "characterName" | "faction" | "activity">,
  excludeId?: string,
) {
  const identity = `${fields.characterName.toLowerCase()}:${fields.faction}`;
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${identity}))`;
  const duplicate = await tx.groupPost.findFirst({
    where: {
      id: excludeId ? { not: excludeId } : undefined,
      characterName: { equals: fields.characterName, mode: "insensitive" },
      faction: fields.faction,
      activity: fields.activity,
      isDemo: false,
      status: "LOOKING",
      expiresAt: { gt: new Date() },
    },
    select: { id: true },
  });
  if (duplicate)
    throw new UserError(
      "Este personaje ya tiene una búsqueda activa para esa actividad. Puedes renovarla desde su publicación.",
    );
}
export async function expirePosts(now = new Date()) {
  return db.groupPost.updateMany({
    where: { status: { in: ["LOOKING", "FULL"] }, expiresAt: { lte: now } },
    data: { status: "EXPIRED" },
  });
}
export async function getGroups(filters: GroupFilters) {
  await expirePosts();
  const where = buildGroupWhere(filters);
  const [posts, count] = await db.$transaction([
    db.groupPost.findMany({
      where,
      select: publicPostSelect,
      orderBy: { createdAt: "desc" },
      take: 12,
      skip: (filters.page - 1) * 12,
    }),
    db.groupPost.count({ where }),
  ]);
  return { posts, count, pages: Math.ceil(count / 12) };
}
export async function getGroup(id: string) {
  if (!idSchema.safeParse(id).success) return null;
  const post = await db.groupPost.findUnique({
    where: { id },
    select: { ...publicPostSelect, discordUsername: true },
  });
  return post ? { ...post, status: effectiveStatus(post) } : null;
}
export async function getCommunityStats() {
  const where = {
    isDemo: false,
    expiresAt: { gt: new Date() },
    status: "LOOKING" as const,
  };
  const factionQuery = db.groupPost.groupBy({
    by: ["faction"],
    where,
    _count: { _all: true },
    orderBy: { faction: "asc" },
  });
  const activityQuery = db.groupPost.groupBy({
    by: ["activity"],
    where,
    _count: { _all: true },
    orderBy: { activity: "asc" },
  });
  const classQuery = db.groupPost.groupBy({
    by: ["characterClass"],
    where,
    _count: { _all: true },
    orderBy: { characterClass: "asc" },
  });
  const [active, characters, factions, activities, classes, demos] =
    await db.$transaction([
      db.groupPost.count({ where }),
      db.groupPost.findMany({
        where,
        select: { characterName: true, faction: true },
        distinct: ["characterName", "faction"],
      }),
      factionQuery,
      activityQuery,
      classQuery,
      db.groupPost.count({
        where: {
          isDemo: true,
          expiresAt: { gt: new Date() },
          status: "LOOKING",
        },
      }),
    ]);
  return {
    active,
    characters: characters.length,
    factions,
    activities,
    classes,
    demos,
  };
}
export async function createGroup(input: unknown, actorHash: string) {
  const data = postSchema.parse(input);
  await enforceRateLimit(db, `create:${actorHash}`, 5, 15 * 60 * 1000);
  await enforceRateLimit(db, "create:global", 100, 60 * 1000);
  const { website: _honeypot, ...fields } = data;
  void _honeypot;
  const token = createToken();
  // Serialize duplicate checks for this character across simultaneous requests.
  const post = await db.$transaction(async (tx) => {
    await ensureNoActiveDuplicate(tx, fields);
    return tx.groupPost.create({
      data: {
        ...fields,
        managerTokenHash: hashSecret(token),
        expiresAt: new Date(Date.now() + POST_LIFETIME_MS),
      },
      select: publicPostSelect,
    });
  });
  return { post, token };
}
export async function ownsGroup(id: string, token?: string) {
  if (!token || !idSchema.safeParse(id).success) return false;
  const post = await db.groupPost.findUnique({
    where: { id },
    select: { managerTokenHash: true, isDemo: true },
  });
  return !!post && !post.isDemo && verifyToken(token, post.managerTokenHash);
}
export async function manageGroup(
  id: string,
  token: string,
  action: "renew" | "full" | "finish",
  actorHash: string,
) {
  idSchema.parse(id);
  if (!["renew", "full", "finish"].includes(action))
    throw new UserError("Acción inválida.");
  await enforceRateLimit(db, `manage:${actorHash}`, 20, 15 * 60 * 1000);
  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${id}))`;
    const post = await tx.groupPost.findUnique({ where: { id } });
    if (!post || post.isDemo || !verifyToken(token, post.managerTokenHash))
      throw new UserError(
        "Solo puedes administrar las búsquedas que publicaste desde este navegador.",
      );
    const current = effectiveStatus(post);
    if (!canTransition(current, action))
      throw new UserError(
        "El estado actual de esta búsqueda no permite esa acción.",
      );
    if (action === "renew") await ensureNoActiveDuplicate(tx, post, id);
    const data =
      action === "renew"
        ? {
            status: "LOOKING" as const,
            expiresAt: new Date(Date.now() + POST_LIFETIME_MS),
          }
        : {
            status:
              action === "full" ? ("FULL" as const) : ("FINISHED" as const),
          };
    return tx.groupPost.update({
      where: { id },
      data,
      select: publicPostSelect,
    });
  });
}
export async function reportGroup(input: unknown, actorHash: string) {
  const { id, reason } = reportSchema.parse(input);
  await enforceRateLimit(db, `report:${actorHash}`, 5, 60 * 60 * 1000);
  if (!(await getGroup(id)))
    throw new UserError("La publicación ya no está disponible.");
  return db.postReport.upsert({
    where: { postId_reporterHash: { postId: id, reporterHash: actorHash } },
    update: {},
    create: { postId: id, reason, reporterHash: actorHash },
    select: { id: true },
  });
}
