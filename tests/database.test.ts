import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomBytes } from "node:crypto";
import { db } from "@/server/db";
import {
  createGroup,
  expirePosts,
  getGroup,
  getGroups,
  getCommunityStats,
  manageGroup,
  ownsGroup,
  reportGroup,
} from "@/server/groups";
import { createToken, enforceRateLimit, hashSecret } from "@/server/security";
import { filterSchema } from "@/features/groups/schema";
import { validPost } from "./fixtures";
const enabled = process.env.RUN_DB_TESTS === "1";
const run = randomBytes(8).toString("hex");
const actor = hashSecret(`test-${run}`);
const name = `Test${run.replace(/[0-9]/g, "x")}`;
const ids: string[] = [];
describe.runIf(enabled)("persistencia PostgreSQL real", () => {
  beforeAll(async () => {
    await db.$connect();
  });
  afterAll(async () => {
    await db.groupPost.deleteMany({ where: { id: { in: ids } } });
    await db.rateLimitBucket.deleteMany({
      where: { key: { contains: actor } },
    });
    await db.$disconnect();
  });
  let id: string;
  let token: string;
  it("crea una publicación persistente y oculta su hash", async () => {
    const result = await createGroup(
      { ...validPost, characterName: name },
      actor,
    );
    id = result.post.id;
    token = result.token;
    ids.push(id);
    expect(result.post.status).toBe("LOOKING");
    expect(result.post).not.toHaveProperty("managerTokenHash");
    expect(await getGroup(id)).toMatchObject({
      id,
      characterName: name,
      discordUsername: validPost.discordUsername,
    });
    expect(
      result.post.expiresAt.getTime() - result.post.createdAt.getTime(),
    ).toBeGreaterThan(86390000);
  });
  it("filtra los datos guardados", async () => {
    const result = await getGroups(
      filterSchema.parse({
        q: name,
        activity: "DUNGEONS",
        faction: "HORDE",
        minLevel: 20,
        maxLevel: 30,
      }),
    );
    expect(result.posts.map((p) => p.id)).toEqual([id]);
    expect(
      (await getGroups(filterSchema.parse({ q: name, faction: "ALLIANCE" })))
        .count,
    ).toBe(0);
  });
  it("rechaza duplicados con diferencia de mayúsculas", async () => {
    await expect(
      createGroup({ ...validPost, characterName: name.toUpperCase() }, actor),
    ).rejects.toThrow("ya tiene una búsqueda activa");
  });
  it("solo autoriza el token del creador", async () => {
    expect(await ownsGroup(id, token)).toBe(true);
    expect(await ownsGroup(id, createToken())).toBe(false);
    await expect(manageGroup(id, createToken(), "full", actor)).rejects.toThrow(
      "Solo podés administrar",
    );
  });
  it("renueva la búsqueda durante 24 horas", async () => {
    const post = await manageGroup(id, token, "renew", actor);
    expect(post.status).toBe("LOOKING");
    expect(post.expiresAt.getTime()).toBeGreaterThan(Date.now() + 86390000);
  });
  it("reporta sin duplicar reportes del mismo visitante", async () => {
    const a = await reportGroup(
      { id, reason: "Publicación de prueba con posible spam." },
      actor,
    );
    const b = await reportGroup(
      { id, reason: "Otro reporte del mismo visitante." },
      actor,
    );
    expect(a.id).toBe(b.id);
    expect(await db.postReport.count({ where: { postId: id } })).toBe(1);
  });
  it("un grupo completo sale de los resultados activos", async () => {
    await manageGroup(id, token, "full", actor);
    expect((await getGroups(filterSchema.parse({ q: name }))).count).toBe(0);
    expect(
      (await getGroups(filterSchema.parse({ q: name, status: "full" }))).count,
    ).toBe(1);
  });
  it("vence incluso un grupo completo y permite renovarlo", async () => {
    await db.groupPost.update({
      where: { id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    await expirePosts();
    expect((await getGroup(id))?.status).toBe("EXPIRED");
    expect((await manageGroup(id, token, "renew", actor)).status).toBe(
      "LOOKING",
    );
  });
  it("impide que una renovación duplique una búsqueda nueva", async () => {
    await db.groupPost.update({
      where: { id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    const replacement = await createGroup(
      { ...validPost, characterName: name },
      actor,
    );
    ids.push(replacement.post.id);
    await expect(manageGroup(id, token, "renew", actor)).rejects.toThrow(
      "ya tiene una búsqueda activa",
    );
    await manageGroup(replacement.post.id, replacement.token, "finish", actor);
    await expect(manageGroup(id, token, "renew", actor)).resolves.toMatchObject(
      { status: "LOOKING" },
    );
  });
  it("excluye demostraciones de todas las estadísticas", async () => {
    const before = await getCommunityStats();
    const { website: _website, ...data } = validPost;
    void _website;
    const demo = await db.groupPost.create({
      data: {
        ...data,
        characterName: `Demo${run.replace(/[0-9]/g, "x")}`,
        isDemo: true,
        managerTokenHash: hashSecret(createToken()),
        expiresAt: new Date(Date.now() + 86400000),
      },
    });
    ids.push(demo.id);
    const after = await getCommunityStats();
    expect(after.active).toBe(before.active);
    expect(after.characters).toBe(before.characters);
    expect(after.classes).toEqual(before.classes);
    expect(after.factions).toEqual(before.factions);
    expect(after.activities).toEqual(before.activities);
    expect(after.demos).toBe(before.demos + 1);
  });
  it("finaliza y evita reabrir búsquedas finalizadas", async () => {
    await manageGroup(id, token, "finish", actor);
    await expect(manageGroup(id, token, "renew", actor)).rejects.toThrow(
      "estado actual",
    );
    expect((await getGroup(id))?.status).toBe("FINISHED");
  });
  it("mantiene el límite bajo peticiones concurrentes", async () => {
    const key = `test:${actor}`;
    const results = await Promise.allSettled(
      Array.from({ length: 8 }, () => enforceRateLimit(db, key, 3, 60000)),
    );
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(3);
    expect(results.filter((r) => r.status === "rejected")).toHaveLength(5);
  });
  it("restablece un límite vencido", async () => {
    const key = `reset:${actor}`;
    await db.rateLimitBucket.create({
      data: { key, count: 99, resetAt: new Date(Date.now() - 1000) },
    });
    await expect(enforceRateLimit(db, key, 3, 60000)).resolves.toBeUndefined();
    expect(
      (await db.rateLimitBucket.findUnique({ where: { key } }))?.count,
    ).toBe(1);
  });
  it("descarta IDs inválidos sin ejecutar una consulta arbitraria", async () => {
    expect(await getGroup("../../hack")).toBeNull();
  });
});
