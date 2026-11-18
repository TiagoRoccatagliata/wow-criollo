export const CLASSES = {
  WARRIOR: {
    label: "Warrior",
    color: "#c69b6d",
    icon: "/wow/classes/warrior.jpg",
  },
  PALADIN: {
    label: "Paladin",
    color: "#f48cba",
    icon: "/wow/classes/paladin.jpg",
  },
  HUNTER: {
    label: "Hunter",
    color: "#aad372",
    icon: "/wow/classes/hunter.jpg",
  },
  ROGUE: { label: "Rogue", color: "#fff468", icon: "/wow/classes/rogue.jpg" },
  PRIEST: {
    label: "Priest",
    color: "#e8e6df",
    icon: "/wow/classes/priest.jpg",
  },
  SHAMAN: {
    label: "Shaman",
    color: "#5199f5",
    icon: "/wow/classes/shaman.jpg",
  },
  MAGE: { label: "Mage", color: "#67d1e8", icon: "/wow/classes/mage.jpg" },
  WARLOCK: {
    label: "Warlock",
    color: "#b59af1",
    icon: "/wow/classes/warlock.jpg",
  },
  DRUID: { label: "Druid", color: "#ff9149", icon: "/wow/classes/druid.jpg" },
} as const;
export const FACTIONS = { HORDE: "Horda", ALLIANCE: "Alianza" } as const;
export const ACTIVITIES = {
  LEVELING: "Leveo",
  DUNGEONS: "Dungeons",
  QUESTS: "Misiones",
  WORLD_PVP: "World PvP",
  BATTLEGROUNDS: "Battlegrounds",
  DUELS: "Duelos",
  RAIDS: "Raids",
  OTHER: "Otros",
} as const;
export const AVAILABILITIES = {
  NOW: "Ahora",
  AFTERNOON: "Por la tarde",
  NIGHT: "Por la noche",
  FLEXIBLE: "A coordinar",
} as const;
export const STATUSES = {
  LOOKING: "Buscando jugadores",
  FULL: "Grupo completo",
  FINISHED: "Finalizado",
  EXPIRED: "Vencida",
} as const;
export type CharacterClass = keyof typeof CLASSES;
export type Activity = keyof typeof ACTIVITIES;
export type Faction = keyof typeof FACTIONS;
export type Availability = keyof typeof AVAILABILITIES;
export type PostStatus = keyof typeof STATUSES;
