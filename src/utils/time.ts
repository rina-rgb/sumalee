export function getEndTime(startTime: number, durationMinutes: number): number {
  return startTime + durationMinutes / 60;
}
export function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = (hour % 1) * 60;
  return `${h.toString().padStart(2, "0")}:${m === 0 ? "00" : m}`;
}