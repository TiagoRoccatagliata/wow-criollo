import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container page-section empty-state">
      <h1>Publicación no encontrada</h1>
      <p>El enlace es incorrecto o la publicación ya no está disponible.</p>
      <Link href="/grupos" className="button button-primary">
        Buscar grupos
      </Link>
    </section>
  );
}
