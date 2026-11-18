import type { Metadata, Viewport } from "next";
import { config } from "@/lib/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DiscordLink } from "@/components/discord-link";
import { bodyFont, headingFont } from "@/lib/fonts";
import "./globals.css";
// Read the public origin and Discord invite from the running container.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: {
    default: `Buscar grupos | ${config.name}`,
    template: `%s | ${config.name}`,
  },
  description: config.description,
  keywords: [
    "WoW Forever en español",
    config.name,
    "Buscar grupo WoW Forever",
    "Comunidad hispana WoW Forever",
    "Grupos para levear WoW",
  ],
  openGraph: {
    title: config.name,
    description: config.description,
    type: "website",
    siteName: config.name,
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  themeColor: "#23272f",
  colorScheme: "light dark",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${bodyFont.variable} ${headingFont.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <a href="#contenido" className="skip-link">
          Ir al contenido
        </a>
        <SiteHeader discord={<DiscordLink />} />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
