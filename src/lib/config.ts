import { brand } from "./brand";

const defaultDiscordInvite = "https://discord.gg/wXUpdUgXGQ";

function discordInvite() {
  const raw = process.env.DISCORD_INVITE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const validHost =
      url.hostname === "discord.gg" || url.hostname === "discord.com";
    const validPath =
      url.hostname === "discord.gg"
        ? /^\/[\w-]+\/?$/.test(url.pathname)
        : /^\/invite\/[\w-]+\/?$/.test(url.pathname);
    return url.protocol === "https:" &&
      validHost &&
      validPath &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export const config = {
  name: brand.name,
  description: brand.description,
  discordInvite: discordInvite() ?? defaultDiscordInvite,
  url: process.env.APP_URL || "http://localhost:3000",
};
