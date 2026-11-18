import type { Metadata } from "next";
import { PostForm } from "@/components/groups/post-form";

export const metadata: Metadata = {
  title: "Publicar búsqueda",
  description:
    "Publica tu personaje, actividad y horario para encontrar grupo en WoW Forever.",
};

export default function PublishPage() {
  return (
    <div className="container page-section publish-page">
      <div className="page-heading">
        <h1>Publicar búsqueda</h1>
        <p>Completa los datos del personaje y del grupo.</p>
      </div>
      <PostForm />
    </div>
  );
}
