export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

export function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
} 