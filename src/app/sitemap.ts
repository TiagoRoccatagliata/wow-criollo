import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { db } from "@/server/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    "",
    "/grupos",
    "/comunidad",
    "/ranking",
  ].map((path) => ({
    url: `${config.url}${path}`,
    changeFrequency: path === "/grupos" ? "hourly" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
  try {
    const posts = await db.groupPost.findMany({
      where: {
        isDemo: false,
        status: "LOOKING",
        expiresAt: { gt: new Date() },
      },
      select: { id: true, updatedAt: true },
      take: 5000,
      orderBy: { createdAt: "desc" },
    });
    return [
      ...pages,
      ...posts.map((post) => ({
        url: `${config.url}/grupos/${post.id}`,
        lastModified: post.updatedAt,
        priority: 0.6,
      })),
    ];
  } catch {
    return pages;
  }
}
