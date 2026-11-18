import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";

export class UserError extends Error {}
export function hashSecret(value: string) {
  const salt = process.env.RATE_LIMIT_SALT;
  if (
    process.env.NODE_ENV === "production" &&
    (!salt || salt.length < 32 || salt === "change-this-for-production")
  ) {
    throw new Error(
      "Configure RATE_LIMIT_SALT with at least 32 random characters.",
    );
  }
  return createHmac("sha256", salt || "wow-local-development-only")
    .update(value)
    .digest("hex");
}
export const createToken = () => randomBytes(32).toString("hex");
export function verifyToken(token: string, expected: string) {
  if (!/^[a-f0-9]{64}$/.test(token) || !/^[a-f0-9]{64}$/.test(expected))
    return false;
  return timingSafeEqual(
    Buffer.from(hashSecret(token), "hex"),
    Buffer.from(expected, "hex"),
  );
}
// Atomic UPSERT: concurrency and multiple app instances share the same limit.
// The counter is committed separately so failed writes also consume quota.
export async function enforceRateLimit(
  tx: Prisma.TransactionClient,
  key: string,
  limit: number,
  windowMs: number,
  now = new Date(),
) {
  const reset = new Date(now.getTime() + windowMs);
  const result = await tx.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt") VALUES (${key}, 1, ${reset})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimitBucket"."resetAt" <= ${now} THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimitBucket"."resetAt" <= ${now} THEN ${reset} ELSE "RateLimitBucket"."resetAt" END
    RETURNING "count"`;
  if (result[0].count > limit)
    throw new UserError(
      "Hiciste varios intentos seguidos. Esperá unos minutos y volvé a intentar.",
    );
}
