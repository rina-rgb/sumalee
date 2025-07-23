// scripts/testScheduler.ts
import fs from "fs";
import path from "path";
import { optimizeWithMatching } from "../src/lib/originalAlgo";
import type {
  Booking,
  Therapist,
  NewRequest,

} from "../src/lib/originalAlgo";

//
// helper: "HH:mm" → minutes since midnight
//
function timeToMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

//
// 1) load JSON
//
const therapistsJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../public/therapists.json"), "utf-8")
) as Array<{
  id: string;
  availability: { weekday: number; startHour: number; endHour: number }[];
}>;

const bookingsJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../public/bookings.json"), "utf-8")
) as Array<{
  id: string;
  therapistId: string;
  date: string;       // "YYYY-MM-DD"
  start: string;      // "HH:mm"
  end: string;        // "HH:mm"
  durationMinutes: number;
}>;

//
// 2) pick a date and duration (from CLI or defaults)
//
const [ , , dateArg, durArg, wsArg, weArg ] = process.argv;
const date = dateArg ?? bookingsJson[0].date;
const duration = durArg ? Number(durArg) : 60;

//
// 3) filter bookings to that date + transform
//
const raw = bookingsJson.filter((b) => b.date === date);
const bookings: Booking[] = raw.map((b) => ({
  id: b.id,
  therapistId: b.therapistId,
  startTime: timeToMins(b.start),
  endTime: timeToMins(b.end),
  durationMinutes: b.durationMinutes,
}));

//
// 4) build Therapist.availability in minutes for that weekday
//
const wd = new Date(date).getDay();
const therapists: Therapist[] = therapistsJson.map((t) => ({
  id: t.id,
  availability: t.availability
    .filter((a) => a.weekday === wd)
    .map((a) => ({
      startTime: a.startHour * 60,
      endTime: a.endHour * 60,
    })),
}));

//
// 5) derive windowStart/windowEnd (or override via CLI)
//
const allStarts = therapists.flatMap((t) => t.availability.map((a) => a.startTime));
const allEnds = therapists.flatMap((t) => t.availability.map((a) => a.endTime));
const windowStart = wsArg ? Number(wsArg) : Math.min(...allStarts);
const windowEnd = weArg ? Number(weArg) : Math.max(...allEnds);

const req: NewRequest = { duration, windowStart, windowEnd };

console.log("===== TestScheduler =====");
console.log(`Date: ${date}`);
console.log(`Duration: ${duration}m, Window: ${windowStart}–${windowEnd}`);

//
// 6) call the algorithm
//
const { slots, relocations, totalWeight } = optimizeWithMatching(
  bookings,
  therapists,
  req
);

//
// 7) log results
//
console.log("\n→ Pure gaps:");
slots.forEach((s) =>
  console.log(
    `  • ${s.therapistId} @ ${Math.floor(s.start/60)
      .toString()
      .padStart(2, "0")}:${(s.start%60).toString().padStart(2, "0")}` +
      `–${Math.floor(s.end/60)
      .toString()
      .padStart(2, "0")}:${(s.end%60).toString().padStart(2, "0")}`
  )
);

console.log("\n→ Relocations needed:");
relocations.forEach((r) =>
  console.log(
    `  • Move ${r.bookingId}: ${r.fromTherapistId}→${r.toTherapistId}` +
      ` @ ${Math.floor(r.slot.start/60)
        .toString()
        .padStart(2, "0")}:${(r.slot.start%60)
        .toString()
        .padStart(2, "0")}` +
      `–${Math.floor(r.slot.end/60)
        .toString()
        .padStart(2, "0")}:${(r.slot.end%60)
        .toString()
        .padStart(2, "0")}`
  )
);

console.log(`\nTotal weight: ${totalWeight.toFixed(2)}`);
