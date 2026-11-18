import { describe, expect, it } from "vitest";
import {
  buildGroupWhere,
  canTransition,
  effectiveStatus,
  POST_LIFETIME_MS,
} from "@/features/groups/logic";
import { filterSchema } from "@/features/groups/schema";
import { createToken, hashSecret, verifyToken } from "@/server/security";
const now = new Date("2026-11-17T18:00:00Z");
describe("vencimiento y estados", () => {
  it("vence exactamente a las 24 horas", () => {
    expect(POST_LIFETIME_MS).toBe(86400000);
    expect(effectiveStatus({ status: "LOOKING", expiresAt: now }, now)).toBe(
      "EXPIRED",
    );
  });
  it("no vence antes del límite", () => {
    expect(
      effectiveStatus(
        { status: "LOOKING", expiresAt: new Date(now.getTime() + 1) },
        now,
      ),
    ).toBe("LOOKING");
  });
  it("los grupos completos también vencen", () => {
    expect(effectiveStatus({ status: "FULL", expiresAt: now }, now)).toBe(
      "EXPIRED",
    );
  });
  it("conserva el estado finalizado", () => {
    expect(effectiveStatus({ status: "FINISHED", expiresAt: now }, now)).toBe(
      "FINISHED",
    );
  });
  it("solo permite transiciones válidas", () => {
    expect(canTransition("EXPIRED", "renew")).toBe(true);
    expect(canTransition("LOOKING", "full")).toBe(true);
    expect(canTransition("FULL", "finish")).toBe(true);
    expect(canTransition("FINISHED", "renew")).toBe(false);
    expect(canTransition("EXPIRED", "full")).toBe(false);
    expect(canTransition("FULL", "renew")).toBe(false);
  });
});
describe("consultas de grupos", () => {
  it("excluye publicaciones viejas por defecto", () => {
    expect(buildGroupWhere(filterSchema.parse({}), now)).toEqual({
      status: "LOOKING",
      expiresAt: { gt: now },
    });
  });
  it("combina actividad, nivel, clase, zona, facción y horario", () => {
    const filters = filterSchema.parse({
      activity: "DUNGEONS",
      minLevel: 20,
      maxLevel: 30,
      characterClass: "PRIEST",
      faction: "HORDE",
      zone: "Baldíos",
      availability: "NIGHT",
    });
    expect(buildGroupWhere(filters, now)).toMatchObject({
      activity: "DUNGEONS",
      level: { gte: 20, lte: 30 },
      characterClass: "PRIEST",
      faction: "HORDE",
      zone: { contains: "Baldíos", mode: "insensitive" },
      availability: "NIGHT",
    });
  });
  it("busca en nombre, zona y descripción sin construir SQL manual", () => {
    const where = buildGroupWhere(filterSchema.parse({ q: "%' OR 1=1" }), now);
    expect(where.OR).toHaveLength(3);
    expect(where.OR?.[0]).toEqual({
      characterName: { contains: "%' OR 1=1", mode: "insensitive" },
    });
  });
  it("permite consultar todo el historial expresamente", () => {
    expect(buildGroupWhere(filterSchema.parse({ status: "all" }), now)).toEqual(
      {},
    );
  });
});
describe("administración anónima segura", () => {
  it("emite tokens aleatorios y valida el hash sin exponer el secreto", () => {
    const token = createToken();
    const hash = hashSecret(token);
    expect(token).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toBe(token);
    expect(verifyToken(token, hash)).toBe(true);
    expect(verifyToken(createToken(), hash)).toBe(false);
  });
  it("rechaza tokens con formato inválido", () => {
    expect(verifyToken("", hashSecret("test"))).toBe(false);
    expect(verifyToken("z".repeat(64), "0".repeat(64))).toBe(false);
    expect(verifyToken("0".repeat(64), "x")).toBe(false);
  });
});
