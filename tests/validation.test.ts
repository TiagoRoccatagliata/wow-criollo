import { describe, expect, it } from "vitest";
import {
  filterSchema,
  idSchema,
  postSchema,
  reportSchema,
} from "@/features/groups/schema";
import { validPost } from "./fixtures";
describe("validación de publicaciones", () => {
  it("acepta una búsqueda y normaliza espacios", () => {
    expect(
      postSchema.parse({ ...validPost, characterName: "  Thorgar  " })
        .characterName,
    ).toBe("Thorgar");
  });
  it("normaliza el usuario de Discord", () => {
    expect(
      postSchema.parse({ ...validPost, discordUsername: " @Thorgar.WoW " })
        .discordUsername,
    ).toBe("thorgar.wow");
  });
  it.each([undefined, "", "a", "a..b", "a b", "https://discord.gg/test", "a".repeat(33)])(
    "rechaza el usuario de Discord inválido %s",
    (discordUsername) => {
      expect(postSchema.safeParse({ ...validPost, discordUsername }).success).toBe(false);
    },
  );
  it.each([0, 61, 5.2, NaN, "24"])("rechaza nivel inválido %s", (level) => {
    expect(postSchema.safeParse({ ...validPost, level }).success).toBe(false);
  });
  it.each([
    "<script>alert(1)</script>",
    "Buscá el link https://evil.test",
    "Entrá en discord.gg/spam",
    "\u0000texto con caracteres de control",
  ])("rechaza contenido inseguro %s", (description) => {
    expect(postSchema.safeParse({ ...validPost, description }).success).toBe(
      false,
    );
  });
  it("rechaza clase y facción manipuladas", () => {
    expect(
      postSchema.safeParse({ ...validPost, characterClass: "DEATH_KNIGHT" })
        .success,
    ).toBe(false);
    expect(
      postSchema.safeParse({ ...validPost, faction: "CUSTOM" }).success,
    ).toBe(false);
  });
  it("rechaza descripciones vacías y muy largas", () => {
    expect(
      postSchema.safeParse({ ...validPost, description: "   " }).success,
    ).toBe(false);
    expect(
      postSchema.safeParse({ ...validPost, description: "a".repeat(1001) })
        .success,
    ).toBe(false);
  });
  it.each([0, 40, 2.5])(
    "limita la cantidad de jugadores %s",
    (playersNeeded) => {
      expect(
        postSchema.safeParse({ ...validPost, playersNeeded }).success,
      ).toBe(false);
    },
  );
  it("rechaza el honeypot lleno", () => {
    expect(
      postSchema.safeParse({ ...validPost, website: "spam" }).success,
    ).toBe(false);
  });
  it("ignora privilegios enviados por el cliente", () => {
    const parsed = postSchema.parse({
      ...validPost,
      status: "FULL",
      isDemo: true,
      managerTokenHash: "attacker",
    });
    expect(parsed).not.toHaveProperty("status");
    expect(parsed).not.toHaveProperty("isDemo");
    expect(parsed).not.toHaveProperty("managerTokenHash");
  });
});
describe("límites de lectura y reportes", () => {
  it("descarta filtros desconocidos e inválidos sin romper la página", () => {
    const filters = filterSchema.parse({
      page: "-1",
      minLevel: "texto",
      faction: "hack",
      q: ["a", "b"],
    });
    expect(filters).toMatchObject({
      page: 1,
      status: "active",
      minLevel: undefined,
      faction: undefined,
      q: undefined,
    });
  });
  it("convierte los filtros numéricos de la URL", () => {
    expect(
      filterSchema.parse({ minLevel: "20", maxLevel: "40", page: "2" }),
    ).toMatchObject({ minLevel: 20, maxLevel: 40, page: 2 });
  });
  it("rechaza identificadores arbitrarios", () => {
    expect(idSchema.safeParse("../../etc/passwd").success).toBe(false);
    expect(idSchema.safeParse("' OR 1=1").success).toBe(false);
  });
  it("exige un motivo útil al reportar", () => {
    expect(
      reportSchema.safeParse({
        id: "00000000-0000-4000-8000-000000000001",
        reason: "spam",
      }).success,
    ).toBe(false);
  });
});
