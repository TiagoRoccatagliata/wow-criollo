import type { Prisma } from "@/generated/prisma/client";
import type { GroupFilters } from "./schema";
import type { PostStatus } from "./catalog";

export const POST_LIFETIME_MS = 24 * 60 * 60 * 1000;
export function effectiveStatus(
  post: { status: PostStatus; expiresAt: Date },
  now = new Date(),
): PostStatus {
  return ["LOOKING", "FULL"].includes(post.status) && post.expiresAt <= now
    ? "EXPIRED"
    : post.status;
}
export function buildGroupWhere(
  filters: GroupFilters,
  now = new Date(),
): Prisma.GroupPostWhereInput {
  const where: Prisma.GroupPostWhereInput = {};
  if (filters.status === "active") {
    where.status = "LOOKING";
    where.expiresAt = { gt: now };
  }
  if (filters.status === "full") {
    where.status = "FULL";
    where.expiresAt = { gt: now };
  }
  if (filters.status === "finished")
    where.status = { in: ["FINISHED", "EXPIRED"] };
  if (filters.activity) where.activity = filters.activity;
  if (filters.characterClass) where.characterClass = filters.characterClass;
  if (filters.faction) where.faction = filters.faction;
  if (filters.availability) where.availability = filters.availability;
  if (filters.zone)
    where.zone = { contains: filters.zone, mode: "insensitive" };
  if (filters.minLevel || filters.maxLevel)
    where.level = { gte: filters.minLevel, lte: filters.maxLevel };
  if (filters.q)
    where.OR = ["characterName", "zone", "description"].map((key) => ({
      [key]: { contains: filters.q, mode: "insensitive" },
    }));
  return where;
}
export function canTransition(
  current: PostStatus,
  action: "renew" | "full" | "finish",
) {
  if (action === "renew") return current === "LOOKING" || current === "EXPIRED";
  if (action === "full") return current === "LOOKING";
  return current === "LOOKING" || current === "FULL";
}
