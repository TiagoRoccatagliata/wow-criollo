import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { randomBytes, createHash } from "node:crypto";
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
// Opt-in fixtures only: each persisted record is explicitly marked as a demo.
const examples = [
  {
    characterName: "Thorgar",
    level: 24,
    characterClass: "WARRIOR",
    faction: "HORDE",
    activity: "DUNGEONS",
    zone: "Cavernas de los Lamentos",
    recommendedLevel: 20,
    schedule: "Hoy · 21:00 h",
    availability: "NIGHT",
    playersNeeded: 2,
    description:
      "Sale una WC tranqui después del laburo. Nos falta healer y un DPS. Buena onda y sin apuro, vamos haciendo todas las quests.",
  },
  {
    characterName: "Lunaris",
    level: 18,
    characterClass: "DRUID",
    faction: "ALLIANCE",
    activity: "LEVELING",
    zone: "Costa Oscura",
    recommendedLevel: 16,
    schedule: "Ahora · hasta las 20:00 h",
    availability: "NOW",
    playersNeeded: 1,
    description:
      "Busco compañero para levear por Costa Oscura. Recién volviendo al juego, hacemos misiones y nos ayudamos con los élites.",
  },
  {
    characterName: "Maleficar",
    level: 32,
    characterClass: "WARLOCK",
    faction: "HORDE",
    activity: "DUNGEONS",
    zone: "Monasterio Escarlata",
    recommendedLevel: 30,
    schedule: "Hoy · 22:30 h",
    availability: "NIGHT",
    playersNeeded: 3,
    description:
      "Armamos para cementerio y biblioteca. Ya somos dos amigos con ganas de sacar equipo. Si es tu primera vez, te damos una mano.",
  },
  {
    characterName: "Frostina",
    level: 27,
    characterClass: "MAGE",
    faction: "ALLIANCE",
    activity: "QUESTS",
    zone: "Montañas Crestagrana",
    recommendedLevel: 24,
    schedule: "Mañana · 18:00 h",
    availability: "AFTERNOON",
    playersNeeded: 2,
    description:
      "Quedaron unas quests de élite pendientes. Busco gente para terminar la zona y después vemos si sale alguna dungeon.",
  },
  {
    characterName: "Aguará",
    level: 45,
    characterClass: "HUNTER",
    faction: "HORDE",
    activity: "WORLD_PVP",
    zone: "Vega de Tuercespina",
    recommendedLevel: 40,
    schedule: "Hoy · 23:00 h",
    availability: "NIGHT",
    playersNeeded: 4,
    description:
      "Sale recorrer Tuercespina en grupo. PvP casual con buena onda. Traigan ganas y algo de paciencia, que siempre termina en aventura.",
  },
  {
    characterName: "Aurelian",
    level: 60,
    characterClass: "PALADIN",
    faction: "ALLIANCE",
    activity: "DUNGEONS",
    zone: "Profundidades de Roca Negra",
    recommendedLevel: 55,
    schedule: "A coordinar · Discord",
    availability: "FLEXIBLE",
    playersNeeded: 3,
    description:
      "Armando grupo para BRD completo, sin rushear. Tengo ganas de hacer las quests pendientes. Se suman todas las experiencias.",
  },
] as const;
try {
  await db.$transaction(async (tx) => {
    await tx.groupPost.deleteMany({ where: { isDemo: true } });
    for (const [i, post] of examples.entries())
      await tx.groupPost.create({
        data: {
          ...post,
          isDemo: true,
          createdAt: new Date(Date.now() - (i + 1) * 11 * 60000),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          managerTokenHash: createHash("sha256")
            .update(randomBytes(32))
            .digest("hex"),
        },
      });
  });
  console.log("6 búsquedas DEMO creadas. Excluidas de estadísticas y sitemap.");
} finally {
  await db.$disconnect();
}
