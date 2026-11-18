import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  SearchX,
  TriangleAlert,
} from "lucide-react";
import { filterSchema } from "@/features/groups/schema";
import { getGroups } from "@/server/groups";
import { GroupCard } from "./group-card";
import { Filters, filterUrl } from "./filters";
export type SearchParams = Record<string, string | string[] | undefined>;
export async function GroupBoard({
  searchParams,
  home = false,
}: {
  searchParams: SearchParams;
  home?: boolean;
}) {
  const filters = filterSchema.parse(searchParams);
  const path = home ? "/" : "/grupos";
  let result;
  try {
    result = await getGroups(filters);
  } catch {
    return (
      <section className="container board-section" id="buscador">
        <BoardTitle />
        <div className="empty-state">
          <TriangleAlert size={34} />
          <h3>No pudimos cargar las búsquedas</h3>
          <p>Intenta de nuevo en unos minutos.</p>
          <Link href={path} className="button button-outline">
            Volver a intentar
          </Link>
        </div>
      </section>
    );
  }
  const hasDemo = result.posts.some((post) => post.isDemo);
  return (
    <section className="container board-section" id="buscador">
      <BoardTitle />
      <Filters key={JSON.stringify(filters)} filters={filters} path={path} />
      <div className="results-header">
        <h3>
          <span className="status-dot" />
          <span>{`${result.count} ${result.count === 1 ? "búsqueda" : "búsquedas"} ${filters.status === "active" ? (result.count === 1 ? "disponible" : "disponibles") : result.count === 1 ? "encontrada" : "encontradas"}`}</span>
        </h3>
        <span>Más recientes primero</span>
      </div>
      {hasDemo && (
        <div className="demo-notice">
          <span>DEMO</span>Datos de demostración. No son grupos reales.
        </div>
      )}
      {filters.minLevel &&
      filters.maxLevel &&
      filters.minLevel > filters.maxLevel ? (
        <div className="inline-message error-message" role="alert">
          El nivel mínimo no puede ser mayor al máximo. Ajustá los filtros.
        </div>
      ) : null}
      {result.posts.length ? (
        <div className="group-grid">
          {result.posts.map((post) => (
            <GroupCard post={post} key={post.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <SearchX size={38} strokeWidth={1.25} />
          <h3>No hay grupos con estos filtros</h3>
          <p>Prueba otros filtros o publica una búsqueda.</p>
          <Link href="/publicar" className="button button-primary">
            <Plus size={17} />
            Publicar búsqueda
          </Link>
        </div>
      )}
      {result.pages > 1 && (
        <nav className="pagination" aria-label="Páginas de resultados">
          {filters.page > 1 && (
            <Link
              href={filterUrl(filters, { page: filters.page - 1 }, path)}
              className="button button-outline"
            >
              <ArrowLeft size={16} />
              Anterior
            </Link>
          )}
          <span>
            Página {filters.page} de {result.pages}
          </span>
          {filters.page < result.pages && (
            <Link
              href={filterUrl(filters, { page: filters.page + 1 }, path)}
              className="button button-outline"
            >
              Siguiente
              <ArrowRight size={16} />
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
function BoardTitle() {
  return (
    <div className="board-title">
      <div>
        <h1>Buscar grupos</h1>
        <p>Publicaciones de jugadores de WoW Forever.</p>
      </div>
      <Link href="/publicar" className="button button-primary">
        <Plus size={15} />
        Publicar búsqueda
      </Link>
    </div>
  );
}
