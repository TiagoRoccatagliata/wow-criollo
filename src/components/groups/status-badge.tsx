import { STATUSES, type PostStatus } from "@/features/groups/catalog";
export function StatusBadge({
  status,
  compact = false,
}: {
  status: PostStatus;
  compact?: boolean;
}) {
  return (
    <span className={`post-status status-${status.toLowerCase()}`}>
      <span className="status-dot" />
      {compact && status === "LOOKING" ? "Buscando grupo" : STATUSES[status]}
    </span>
  );
}
