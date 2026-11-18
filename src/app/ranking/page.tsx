import type { Metadata } from "next";
import { BarChart3, Flag, Swords, Users } from "lucide-react";
import { getCommunityStats } from "@/server/groups";
import { ACTIVITIES, CLASSES, FACTIONS } from "@/features/groups/catalog";
import { ActivityIcon, ClassIcon, FactionIcon } from "@/components/icons";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Estadísticas de la comunidad",
  description:
    "Actividad real de la comunidad de habla hispana de WoW Forever: búsquedas activas, clases y facciones.",
};
export default async function RankingPage() {
  const stats = await getCommunityStats();
  return (
    <div className="container page-section">
      <div className="page-heading">
        <h1>Estadísticas</h1>
        <p>Publicaciones activas de la comunidad.</p>
      </div>
      <div className="ranking-summary">
        <div className="metric-panel">
          <Swords />
          <strong>{stats.active}</strong>
          <span>Búsquedas activas</span>
        </div>
        <div className="metric-panel">
          <Users />
          <strong>{stats.characters}</strong>
          <span>Personajes buscando grupo</span>
        </div>
      </div>
      <p className="stats-explainer">
        No incluye datos de demostración. Los personajes se identifican por
        nombre y facción, no por usuario verificado.
      </p>
      <div className="ranking-grid">
        <StatPanel
          title="Clases más utilizadas"
          icon={<Swords size={20} />}
          entries={stats.classes.map((item) => ({
            label: CLASSES[item.characterClass].label,
            count: item._count._all,
            color: CLASSES[item.characterClass].color,
            image: <ClassIcon characterClass={item.characterClass} size={24} />,
          }))}
          total={stats.active}
        />
        <StatPanel
          title="Distribución por facción"
          icon={<Flag size={20} />}
          entries={stats.factions.map((item) => ({
            label: FACTIONS[item.faction],
            count: item._count._all,
            color: item.faction === "HORDE" ? "#c8786c" : "#73a8db",
            image: <FactionIcon faction={item.faction} size={24} />,
          }))}
          total={stats.active}
        />
        <StatPanel
          title="Publicaciones por actividad"
          icon={<BarChart3 size={20} />}
          entries={stats.activities.map((item) => ({
            label: ACTIVITIES[item.activity],
            count: item._count._all,
            color: "#58c4dc",
            image: <ActivityIcon activity={item.activity} size={24} />,
          }))}
          total={stats.active}
        />
      </div>
    </div>
  );
}
function StatPanel({
  title,
  icon,
  entries,
  total,
}: {
  title: string;
  icon: React.ReactNode;
  entries: {
    label: string;
    count: number;
    color: string;
    image: React.ReactNode;
  }[];
  total: number;
}) {
  return (
    <section className="stat-panel">
      <h2>
        {icon}
        {title}
      </h2>
      {entries.length ? (
        <ul className="stat-bars">
          {entries
            .sort((a, b) => b.count - a.count)
            .map((entry) => (
              <li key={entry.label}>
                <div>
                  <span className="stat-label">
                    {entry.image}
                    {entry.label}
                  </span>
                  <strong>{entry.count}</strong>
                </div>
                <div className="stat-track">
                  <span
                    style={{
                      width: `${total ? (entry.count / total) * 100 : 0}%`,
                      background: entry.color,
                    }}
                  />
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="stat-empty">
          <p>Sin publicaciones activas.</p>
        </div>
      )}
    </section>
  );
}
