import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
try {
  const result = await db.groupPost.updateMany({
    where: {
      status: { in: ["LOOKING", "FULL"] },
      expiresAt: { lte: new Date() },
    },
    data: { status: "EXPIRED" },
  });
  await db.rateLimitBucket.deleteMany({
    where: { resetAt: { lt: new Date() } },
  });
  console.log(
    `${result.count} publicaciones vencidas. Límites antiguos limpiados.`,
  );
} finally {
  await db.$disconnect();
}
