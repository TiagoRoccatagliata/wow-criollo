import { Suspense } from "react";
import { GroupBoard, type SearchParams } from "@/components/groups/group-board";
import { BoardSkeleton } from "@/components/groups/skeleton";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<BoardSkeleton />}>
      <GroupBoard searchParams={await searchParams} home />
    </Suspense>
  );
}
