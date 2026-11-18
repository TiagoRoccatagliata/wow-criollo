import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import { getGroup, ownsGroup } from "@/server/groups";
import { ownerToken } from "@/server/visitor";
import {
  ACTIVITIES,
  AVAILABILITIES,
  CLASSES,
  FACTIONS,
} from "@/features/groups/catalog";
import { formatDate } from "@/lib/format";
import { ActivityIcon, ClassIcon, FactionIcon } from "@/components/icons";
import { DiscordLink } from "@/components/discord-link";
import { ManagePost, ReportPost } from "@/components/groups/manage-post";
import { StatusBadge } from "@/components/groups/status-badge";
import type { CSSProperties } from "react";
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ publicado?: string }>;
};
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getGroup((await params).id);
  if (!post) return { title: "Búsqueda no encontrada" };
  return {
    title: `${post.zone} · ${post.characterName} busca grupo`,
    description: post.description.slice(0, 160),
    robots: post.isDemo ? { index: false, follow: false } : undefined,
    alternates: { canonical: `/grupos/${post.id}` },
  };
}
export default async function GroupDetail({ params, searchParams }: Props) {
  const { id } = await params;
  const post = await getGroup(id);
  if (!post) notFound();
  const isOpen = post.status === "LOOKING" && !post.isDemo;
  const discordUsername = isOpen ? post.discordUsername : null;
  const owner = await ownsGroup(id, await ownerToken(id));
  const published = owner && (await searchParams).publicado === "1";
  return (
    <div className="container page-section">
      <Link href="/grupos" className="back-link">
        <ArrowLeft size={15} />
        Buscar grupos
      </Link>
      {published && (
        <div className="inline-message success-message" role="status">
          Búsqueda publicada.
        </div>
      )}
      {post.isDemo && (
        <div className="demo-notice">
          <span>DEMO</span>Publicación de demostración. No es un grupo real.
        </div>
      )}
      <div className="detail-layout">
        <article className="detail-panel">
          <div className="detail-topline">
            <span className="activity-badge">
              <ActivityIcon activity={post.activity} size={24} />
              {ACTIVITIES[post.activity]}
            </span>
            <StatusBadge status={post.status} />
          </div>
          <h1>{post.zone}</h1>
          <p className="detail-subtitle">
            <MapPin size={16} />
            WoW Forever<span>·</span>Nivel recomendado {post.recommendedLevel}+
          </p>
          <div
            className="detail-character"
            style={
              {
                "--class-color": CLASSES[post.characterClass].color,
              } as CSSProperties
            }
          >
            <span className="class-emblem">
              <ClassIcon characterClass={post.characterClass} size={48} />
            </span>
            <div>
              <h2>
                {post.characterName}
                <span className="level-badge">{post.level}</span>
              </h2>
              <p>
                <span className="class-name">
                  {CLASSES[post.characterClass].label}
                </span>
                <span> · </span>
                <span
                  className={`faction-label ${
                    post.faction === "HORDE"
                      ? "faction-horde"
                      : "faction-alliance"
                  }`}
                >
                  <FactionIcon faction={post.faction} size={18} />
                  {FACTIONS[post.faction]}
                </span>
              </p>
            </div>
          </div>
          <h3>Descripción</h3>
          <p className="detail-description">{post.description}</p>
          <div className="detail-facts">
            <div>
              <Clock3 size={20} />
              <span>
                Cuándo<strong>{post.schedule}</strong>
                <small>
                  {AVAILABILITIES[post.availability]} · Horario UTC−3
                </small>
              </span>
            </div>
            <div>
              <Users size={20} />
              <span>
                Lugares disponibles
                <strong>
                  {post.playersNeeded}{" "}
                  {post.playersNeeded === 1 ? "jugador" : "jugadores"}
                </strong>
              </span>
            </div>
            <div>
              <CalendarDays size={20} />
              <span>
                Publicado<strong>{formatDate(post.createdAt)}</strong>
                <small>
                  {post.status === "EXPIRED" ? "Venció" : "Vence"}:{" "}
                  {formatDate(post.expiresAt)}
                </small>
              </span>
            </div>
          </div>
          {owner && <ManagePost id={post.id} status={post.status} />}
        </article>
        <aside className="detail-sidebar">
          <div className="join-panel">
            <h2>Contacto</h2>
            <p>
              {post.isDemo
                ? "Este grupo es de demostración."
                : discordUsername
                  ? (
                    <>
                      Agrega a <strong>@{discordUsername}</strong> en Discord
                      para coordinar.
                    </>
                  )
                  : isOpen
                    ? `Busca a ${post.characterName} en el Discord de la comunidad.`
                    : "Esta búsqueda ya no está abierta."}
            </p>
            <DiscordLink>Discord de la comunidad</DiscordLink>
          </div>
          {!post.isDemo && <ReportPost id={post.id} />}
        </aside>
      </div>
    </div>
  );
}
