import type { Metadata } from "next";
import { Suspense } from "react";
import { GroupBoard, type SearchParams } from "@/components/groups/group-board";
import { BoardSkeleton } from "@/components/groups/skeleton";
export const metadata: Metadata = {
  title: "Buscar grupos de WoW Forever",
  description:
    "Encuentra jugadores hispanohablantes por actividad, nivel, clase, facción y horario. Arma tu próximo grupo en WoW Forever.",
  alternates: { canonical: "/grupos" },
};
export const dynamic = "force-dynamic";
export default async function GroupsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<BoardSkeleton />}>
      <GroupBoard searchParams={await searchParams} />
    </Suspense>
  );
}
