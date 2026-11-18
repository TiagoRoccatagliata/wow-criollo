export function relativeTime(date: Date) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );
  if (minutes < 1) return "recién publicado";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `hace ${hours} h` : `hace ${Math.floor(hours / 24)} días`;
}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Etc/GMT+3",
    hourCycle: "h23",
  }).format(date);
}
