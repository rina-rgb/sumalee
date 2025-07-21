import { TIME_GRID_ROW_HEIGHT, TIME_GRID_BASE_HOUR, TIME_GRID_INTERVAL_MINUTES } from "./constants";
export function formatHour(hour: string | number | undefined): string {
  if (hour === undefined) return "0";
  const h = Math.floor(Number(hour));
  const m = (Number(hour) % 1) * 60;
  return `${h.toString().padStart(2, "0")}:${m === 0 ? "00" : m}`;
}

export const calculateEndTime = (start: string, durationMinutes: number): string => {
  if (!start) return "";
  const [startH, startM] = start.split(':').map(Number);
  
  // Create a date object to handle time calculations safely
  const date = new Date();
  date.setHours(startH, startM, 0, 0);
  date.setMinutes(date.getMinutes() + durationMinutes);
  
  const endH = String(date.getHours()).padStart(2, '0');
  const endM = String(date.getMinutes()).padStart(2, '0');
  
  return `${endH}:${endM}`;
};

export function getAppointmentBlockStyle(
  start: string,
  end: string,
  options: {
    rowHeight?: number;
    baseHour?: number;
    intervalMinutes?: number;
  } = {}
) {
  const { rowHeight = TIME_GRID_ROW_HEIGHT, baseHour = TIME_GRID_BASE_HOUR, intervalMinutes = TIME_GRID_INTERVAL_MINUTES } = options;

  if (!start || !end) {
    return { top: "0px", height: "0px" };
  }

  const [h, m] = start.split(":").map(Number);
  const totalStartMinutes = h * 60 + m;
  const offsetMins = totalStartMinutes - baseHour * 60;
  const top = (offsetMins / intervalMinutes) * rowHeight;

  const [eh, em] = end.split(":").map(Number);
  const totalEndMinutes = eh * 60 + em;
  const durationMins = totalEndMinutes - totalStartMinutes;
  const height = (durationMins / intervalMinutes) * rowHeight;

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}