import type { Activity, Faction } from "@/features/groups/catalog";

export const WOW_ASSETS = {
  logo: "/wow/brand/wow-forever.png",
  community: "/wow/art/forever-cinematic.webp",
} as const;

export const FACTION_ICONS = {
  HORDE: "/wow/factions/horde.jpg",
  ALLIANCE: "/wow/factions/alliance.jpg",
} as const satisfies Record<Faction, string>;

export const ACTIVITY_ICONS = {
  LEVELING: "/wow/activities/leveling.jpg",
  DUNGEONS: "/wow/activities/dungeons.jpg",
  QUESTS: "/wow/activities/quests.jpg",
  WORLD_PVP: "/wow/activities/world-pvp.jpg",
  BATTLEGROUNDS: "/wow/activities/battlegrounds.jpg",
  DUELS: "/wow/activities/duels.jpg",
  RAIDS: "/wow/activities/raids.jpg",
  OTHER: "/wow/activities/other.jpg",
} as const satisfies Record<Activity, string>;
