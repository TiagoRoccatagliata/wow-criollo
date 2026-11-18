import "server-only";
import { isIP } from "node:net";
import { cookies, headers } from "next/headers";
import { hashSecret } from "./security";

export async function actorHash() {
  const h = await headers();
  // Never trust a visitor-supplied forwarding header without a configured edge proxy.
  const ip =
    process.env.TRUST_PROXY === "true"
      ? h.get("x-forwarded-for")?.split(",").at(-1)?.trim()
      : undefined;
  // Direct local deployments use a conservative shared quota, which cannot be bypassed with a new cookie.
  return hashSecret(ip && isIP(ip) ? ip : "direct-deployment-shared-quota");
}
export const ownerCookieName = (id: string) => `wow-owner-${id}`;
export async function ownerToken(id: string) {
  return (await cookies()).get(ownerCookieName(id))?.value;
}
export async function saveOwnerToken(id: string, token: string) {
  (await cookies()).set(ownerCookieName(id), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/grupos/${id}`,
    maxAge: 30 * 24 * 60 * 60,
  });
}
