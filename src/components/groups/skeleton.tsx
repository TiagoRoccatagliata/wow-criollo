export function BoardSkeleton() {
  return (
    <div
      className="container board-section"
      role="status"
      aria-label="Cargando búsquedas"
    >
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-filter" />
      <div className="group-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <div className="skeleton skeleton-card" key={i} />
        ))}
      </div>
      <span className="sr-only">Cargando búsquedas…</span>
    </div>
  );
}
