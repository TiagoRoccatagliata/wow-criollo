"use client";
import { TriangleAlert } from "lucide-react";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container page-section empty-state">
      <TriangleAlert size={38} />
      <h1>Algo salió mal</h1>
      <p>No pudimos completar esta acción. Prueba de nuevo en unos minutos.</p>
      <button className="button button-primary" onClick={reset}>
        Volver a intentar
      </button>
    </section>
  );
}
