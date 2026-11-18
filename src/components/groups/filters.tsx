import Link from "next/link";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  ACTIVITIES,
  AVAILABILITIES,
  type Activity,
} from "@/features/groups/catalog";
import type { GroupFilters } from "@/features/groups/schema";
import { ActivityIcon } from "../icons";
import { CatalogSelect } from "./catalog-select";
import { Select } from "../select";
export function filterUrl(
  filters: GroupFilters,
  change: Partial<GroupFilters>,
  path = "/grupos",
) {
  const values = { ...filters, ...change };
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== "" &&
      !(key === "page" && value === 1) &&
      !(key === "status" && value === "active")
    )
      params.set(key, String(value));
  });
  return `${path}${params.size ? `?${params}` : ""}`;
}
export function Filters({
  filters,
  path = "/grupos",
}: {
  filters: GroupFilters;
  path?: string;
}) {
  const activeCount = [
    filters.characterClass,
    filters.faction,
    filters.availability,
    filters.minLevel,
    filters.maxLevel,
    filters.zone,
  ].filter(Boolean).length;
  return (
    <>
      <div className="activity-tabs" aria-label="Filtrar por actividad">
        {[
          { value: "", label: "Todas las actividades" },
          ...Object.entries(ACTIVITIES).map(([value, label]) => ({
            value,
            label,
          })),
        ].map(({ value, label }) => (
          <Link
            key={value}
            href={filterUrl(
              filters,
              {
                activity: value
                  ? (value as GroupFilters["activity"])
                  : undefined,
                page: 1,
              },
              path,
            )}
            className={`activity-tab ${(filters.activity || "") === value ? "selected" : ""}`}
            aria-current={
              (filters.activity || "") === value ? "true" : undefined
            }
          >
            {value && <ActivityIcon activity={value as Activity} size={22} />}
            {label}
          </Link>
        ))}
      </div>
      <form action={path} className="filters-form">
        <div className="filter-primary">
          <label className="search-input">
            <Search size={19} />
            <span className="sr-only">
              Buscar personaje, zona o palabra clave
            </span>
            <input
              name="q"
              defaultValue={filters.q}
              maxLength={100}
              placeholder="Personaje, dungeon, zona…"
            />
          </label>
          <label className="filter-select">
            <span className="sr-only">Actividad</span>
            <CatalogSelect kind="activity" defaultValue={filters.activity} />
          </label>
          <label className="filter-select">
            <span className="sr-only">Facción</span>
            <CatalogSelect kind="faction" defaultValue={filters.faction} />
          </label>
          <button className="button button-primary" type="submit">
            <Search size={17} />
            Buscar
          </button>
        </div>
        <details
          className="advanced-filters"
          open={activeCount > 0 || filters.status !== "active"}
        >
          <summary>
            <SlidersHorizontal size={15} />
            Más filtros
            {activeCount > 0 && (
              <span className="filter-count">{activeCount}</span>
            )}
          </summary>
          <div className="filter-grid">
            <label>
              Clase
              <CatalogSelect
                kind="characterClass"
                defaultValue={filters.characterClass}
              />
            </label>
            <label>
              Nivel mínimo
              <input
                name="minLevel"
                type="number"
                min={1}
                max={60}
                placeholder="1"
                defaultValue={filters.minLevel}
              />
            </label>
            <label>
              Nivel máximo
              <input
                name="maxLevel"
                type="number"
                min={1}
                max={60}
                placeholder="60"
                defaultValue={filters.maxLevel}
              />
            </label>
            <label>
              Zona
              <input
                name="zone"
                placeholder="Ej. Los Baldíos"
                maxLength={80}
                defaultValue={filters.zone}
              />
            </label>
            <label>
              Disponibilidad
              <Select
                name="availability"
                defaultValue={filters.availability || ""}
              >
                <option value="">Cualquier horario</option>
                {Object.entries(AVAILABILITIES).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              Estado
              <Select name="status" defaultValue={filters.status}>
                <option value="active">Buscando jugadores</option>
                <option value="full">Grupo completo</option>
                <option value="finished">Finalizadas y vencidas</option>
                <option value="all">Todas</option>
              </Select>
            </label>
          </div>
        </details>
        {(filters.q ||
          filters.activity ||
          activeCount > 0 ||
          filters.status !== "active") && (
          <div className="filter-reset">
            <Link href={path}>
              <RotateCcw size={13} />
              Limpiar filtros
            </Link>
          </div>
        )}
      </form>
    </>
  );
}
