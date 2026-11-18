import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/lib/brand";
export const alt = `${brand.name} — Grupos de WoW Forever en español`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const [logo, artwork, headingFont, bodyFont] = await Promise.all([
    readFile(join(process.cwd(), "public/wow/brand/wow-forever.png")),
    readFile(join(process.cwd(), "public/wow/art/forever-cinematic.jpg")),
    readFile(join(process.cwd(), "src/app/fonts/bricolage-grotesque-og.ttf")),
    readFile(join(process.cwd(), "src/app/fonts/dm-sans-og.ttf")),
  ]);
  return new ImageResponse(
    <div
      style={{
        background: "#23272f",
        color: "#f6f7f9",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "90px",
        position: "relative",
        fontFamily: "DM Sans",
      }}
    >
      {/* ImageResponse embeds local assets directly, without a remote request. */}
      <img
        src={`data:image/jpeg;base64,${artwork.toString("base64")}`}
        alt=""
        width={1200}
        height={630}
        style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          background:
            "linear-gradient(90deg, rgba(35,39,47,0.98) 0%, rgba(35,39,47,0.92) 50%, rgba(35,39,47,0.3) 100%)",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          fontSize: 38,
          fontFamily: "Bricolage Grotesque",
          fontWeight: 700,
          color: "#58c4dc",
          marginBottom: 30,
          position: "relative",
        }}
      >
        <img
          src={`data:image/png;base64,${logo.toString("base64")}`}
          alt="World of Warcraft Forever"
          width={118}
          height={100}
        />
        {brand.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 78,
          fontWeight: 700,
          fontFamily: "Bricolage Grotesque",
          letterSpacing: -2,
          position: "relative",
        }}
      >
        Buscar grupos
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          marginTop: 25,
          color: "#b5bdca",
          position: "relative",
        }}
      >
        Jugadores hispanohablantes de WoW Forever.
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 32,
          left: 90,
          fontSize: 17,
          color: "#b5bdca",
        }}
      >
        Comunidad independiente · Imágenes © Blizzard Entertainment
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: headingFont,
          weight: 700,
          style: "normal",
        },
        { name: "DM Sans", data: bodyFont, weight: 400, style: "normal" },
      ],
    },
  );
}
