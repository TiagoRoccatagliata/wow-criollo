import { z } from "zod";
import { ACTIVITIES, AVAILABILITIES, CLASSES, FACTIONS } from "./catalog";

const cleanText = (min: number, max: number) =>
  z
    .string({ error: "Completa este campo con texto." })
    .trim()
    .min(min, `Escribe al menos ${min} caracteres.`)
    .max(max, `Usa hasta ${max} caracteres.`)
    .refine(
      (text) => !/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(text),
      "Usa texto simple, sin etiquetas ni caracteres de control.",
    );
const level = z
  .number({ error: "Ingresa un nivel válido." })
  .int("Ingresa un número entero.")
  .min(1, "El nivel mínimo es 1.")
  .max(60, "El nivel máximo es 60.");
export const postSchema = z.object({
  characterName: cleanText(2, 24).regex(
    /^[\p{L}][\p{L}' -]*$/u,
    "Usa letras, espacios, apóstrofes o guiones.",
  ),
  level,
  characterClass: z.enum(
    Object.keys(CLASSES) as [
      keyof typeof CLASSES,
      ...Array<keyof typeof CLASSES>,
    ],
    { error: "Elige una clase válida." },
  ),
  faction: z.enum(
    Object.keys(FACTIONS) as [
      keyof typeof FACTIONS,
      ...Array<keyof typeof FACTIONS>,
    ],
    { error: "Elige una facción válida." },
  ),
  activity: z.enum(
    Object.keys(ACTIVITIES) as [
      keyof typeof ACTIVITIES,
      ...Array<keyof typeof ACTIVITIES>,
    ],
    { error: "Elige una actividad válida." },
  ),
  zone: cleanText(2, 80),
  recommendedLevel: level,
  schedule: cleanText(3, 100),
  availability: z.enum(
    Object.keys(AVAILABILITIES) as [
      keyof typeof AVAILABILITIES,
      ...Array<keyof typeof AVAILABILITIES>,
    ],
    { error: "Elige un horario disponible." },
  ),
  description: cleanText(20, 1000).refine(
    (text) => !/(https?:\/\/|www\.|discord\.(gg|com))/i.test(text),
    "No incluyas enlaces. Nos encontramos en el Discord de la comunidad.",
  ),
  discordUsername: z
    .string({ error: "Ingresa tu nombre de usuario de Discord." })
    .transform((username) => username.trim().replace(/^@/, "").toLowerCase())
    .pipe(
      z
        .string()
        .min(2, "Tu usuario de Discord debe tener al menos 2 caracteres.")
        .max(32, "Tu usuario de Discord puede tener hasta 32 caracteres.")
        .regex(
          /^(?!.*\.\.)[a-z0-9_.]+$/,
          "Usa tu usuario de Discord con letras, números, guiones bajos o puntos no consecutivos.",
        ),
    ),
  playersNeeded: z
    .number({ error: "Ingresa cuántos jugadores buscas." })
    .int("Ingresa una cantidad entera.")
    .min(1, "Busca al menos 1 jugador.")
    .max(39, "Puedes buscar hasta 39 jugadores."),
  website: z.string().max(0, "No pudimos procesar la búsqueda.").optional(),
});
export type PostInput = z.infer<typeof postSchema>;
export const idSchema = z.uuid();
export const reportSchema = z.object({
  id: idSchema,
  reason: cleanText(10, 500),
});
const optionalEnum = <T extends string>(values: T[]) =>
  z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(values as [T, ...T[]]).optional(),
  );
export const filterSchema = z.object({
  q: z.string().trim().max(100).optional().catch(undefined),
  activity: optionalEnum(
    Object.keys(ACTIVITIES) as Array<keyof typeof ACTIVITIES>,
  ).catch(undefined),
  characterClass: optionalEnum(
    Object.keys(CLASSES) as Array<keyof typeof CLASSES>,
  ).catch(undefined),
  faction: optionalEnum(
    Object.keys(FACTIONS) as Array<keyof typeof FACTIONS>,
  ).catch(undefined),
  availability: optionalEnum(
    Object.keys(AVAILABILITIES) as Array<keyof typeof AVAILABILITIES>,
  ).catch(undefined),
  zone: z.string().trim().max(80).optional().catch(undefined),
  minLevel: z.coerce.number().int().min(1).max(60).optional().catch(undefined),
  maxLevel: z.coerce.number().int().min(1).max(60).optional().catch(undefined),
  status: z
    .enum(["active", "all", "full", "finished"])
    .default("active")
    .catch("active"),
  page: z.coerce.number().int().min(1).max(1000).default(1).catch(1),
});
export type GroupFilters = z.infer<typeof filterSchema>;
