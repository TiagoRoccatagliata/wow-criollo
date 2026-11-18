import type { Metadata } from "next";
import Image from "next/image";
import { DiscordLink } from "@/components/discord-link";
import { FactionIcon } from "@/components/icons";
import { WOW_ASSETS } from "@/lib/wow-assets";

export const metadata: Metadata = {
  title: "Comunidad",
  description:
    "Comunidad de habla hispana de WoW Forever: participación, Discord y reglas.",
};

export default function CommunityPage() {
  return (
    <div className="container page-section prose-page">
      <div className="page-heading">
        <h1>Comunidad</h1>
        <p>Jugadores hispanohablantes de WoW Forever.</p>
      </div>
      <figure className="community-art">
        <Image
          src={WOW_ASSETS.community}
          alt="Un tauren y un oso contemplan un valle de Azeroth en la cinemática de World of Warcraft Forever."
          width={1600}
          height={667}
          sizes="(max-width: 850px) calc(100vw - 40px), 800px"
          preload
        />
        <figcaption>
          World of Warcraft Forever · Imagen oficial de Blizzard Entertainment.
        </figcaption>
      </figure>
      <div
        className="community-factions"
        aria-label="Facciones de la comunidad"
      >
        <span>
          <FactionIcon faction="HORDE" size={28} /> Horda
        </span>
        <span>
          <FactionIcon faction="ALLIANCE" size={28} /> Alianza
        </span>
        <p>Un lugar para jugadores de ambas facciones.</p>
      </div>
      <section id="discord" className="content-section">
        <h2>Discord</h2>
        <p>
          La web sirve para encontrar grupos. En Discord coordinamos para jugar.
        </p>
        <DiscordLink>Unirme a Discord</DiscordLink>
      </section>
      <section className="content-section">
        <h2>Cómo participar</h2>
        <ol className="plain-list">
          <li>Busca un grupo o publica tu búsqueda.</li>
          <li>Agrega al jugador en Discord con el usuario que figura en su búsqueda.</li>
          <li>Cuando tu grupo se llene, marca la búsqueda como completa.</li>
        </ol>
      </section>
      <section id="reglas" className="content-section">
        <h2>Reglas</h2>
        <ul className="plain-list">
          <li>Respeta a los demás. No se permite acoso ni discriminación.</li>
          <li>No publiques spam, venta de oro, cuentas o servicios.</li>
          <li>Mantén el estado de tu búsqueda actualizado.</li>
          <li>No compartas datos personales en las publicaciones.</li>
          <li>Reporta las publicaciones que incumplan estas reglas.</li>
        </ul>
      </section>
      <section className="content-section">
        <h2>Hermandades en español</h2>
        <p>Próximamente.</p>
      </section>
      <section id="creditos" className="content-section asset-credits">
        <h2>Créditos de las imágenes</h2>
        <p>
          El logo y la imagen de WoW Forever provienen del{" "}
          <a
            href="https://blizzard.gamespress.com/World-of-Warcraft-Forever-Classic"
            target="_blank"
            rel="noopener noreferrer"
          >
            centro de prensa de Blizzard
          </a>
          . Los iconos de clases, facciones y actividades pertenecen a World of
          Warcraft y se obtuvieron del CDN oficial de Blizzard.
        </p>
        <p>
          © Blizzard Entertainment, Inc. Todos los derechos reservados. World of
          Warcraft y Warcraft son marcas comerciales o marcas registradas de
          Blizzard Entertainment, Inc., en EE. UU. y otros países. Este es un
          fansite comunitario independiente.
        </p>
        <p>
          <a
            href="https://www.blizzard.com/en-us/legal/c1ae32ac-7ff9-4ac3-a03b-fc04b8697010/blizzard-legal-faq"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de fansites
          </a>
          {" · "}
          <a
            href="https://www.blizzard.com/en-us/legal/8bcb0794-6641-4ce3-a573-8eb243bab342/blizzard-entertainment-logo-and-trademark-guidelines"
            target="_blank"
            rel="noopener noreferrer"
          >
            Normas de marcas
          </a>
          {" · "}
          <a href="/wow/sources.json">Fuentes de los recursos</a>
        </p>
        <p>
          Tipografía: Bricolage Grotesque y DM Sans, alojadas en este sitio bajo
          la licencia SIL Open Font License.{" "}
          <a href="/fonts/bricolage-grotesque-OFL.txt">
            Licencia de Bricolage Grotesque
          </a>
          {" · "}
          <a href="/fonts/dm-sans-OFL.txt">Licencia de DM Sans</a>
        </p>
      </section>
    </div>
  );
}
