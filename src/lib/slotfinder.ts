// slotFinder.ts

import { BookingIntervalWithTherapist } from "../types";

// --- Types ---------------------------------------------------------

/** Raw booking interval, with HH:mm strings */
export interface BookingInterval {
	start: string; // "HH:mm"
	end: string; // "HH:mm"
}

/** Candidate slot metadata (in minutes) */
interface Candidate {
	slotStart: number;
	slotEnd: number;
	freeStart: number;
	freeEnd: number;
}

/** Classification of a single slot */
type SlotKind = "strict" | "soft" | "bad";

interface ClassifiedSlot {
	kind: SlotKind;
	slot: string; // "HH:mm"
	reason?: string; // only for bad
}

/** Final output buckets */
export interface SlotClassification {
	strict: string[]; // ideal slots
	soft: string[]; // acceptable “one‐side” fills
	bad: string[]; // wasteful slots
	badReasons: Record<string, string>; // reasons per bad slot
}

// --- Public API ----------------------------------------------------

/**
 * Find and classify all possible appointment slots for a given day,
 * returning strict, soft, and bad (with reasons) buckets.
 *
 * @param durationMinutes  Appointment length in minutes.
 * @param bookings         Array of { start, end } strings ("HH:mm").
 * @param minGapMinutes    Minimum gap before/after appointments.
 * @param dayStartStr      Workday start ("HH:mm"), default "08:00".
 * @param dayEndStr        Workday end   ("HH:mm"), default "18:00".
 */
export function findBestScheduleSlots(
	durationMinutes: number = 60,
	bookings: BookingIntervalWithTherapist[],
	minGapMinutes: number = 60,
	dayStartStr: string = "08:00",
	dayEndStr: string = "18:00"
): SlotClassification {
	const dayStart = hhmmToMinutes(dayStartStr);
	const dayEnd = hhmmToMinutes(dayEndStr);
	const intervals = bookingsToIntervals(bookings);
	const freeIntervals = getFreeIntervals(intervals, dayStart, dayEnd);
	const candidates = generateCandidates(freeIntervals, durationMinutes, 15);

	const classified: ClassifiedSlot[] = candidates.map((c) =>
		classifySlot(c, minGapMinutes)
	);

	return partitionSlots(classified);
}

// --- Helpers -------------------------------------------------------

/** Convert HH:mm strings to minute‐intervals and sort */
function bookingsToIntervals(
	bookings: BookingIntervalWithTherapist[]
): Array<{ start: number; end: number; durationMinutes: number }> {
	return bookings
		.map((b) => ({
			start: hhmmToMinutes(b.start),
			end: hhmmToMinutes(b.end),
			durationMinutes: Number(b.durationMinutes),
		}))
		.sort((a, b) => a.start - b.start);
}

/** Compute free [start,end] ranges (in minutes) between sorted intervals */
function getFreeIntervals(
	intervals: Array<{ start: number; end: number; durationMinutes: number }>,
	dayStart: number,
	dayEnd: number
): Array<[number, number]> {
	if (intervals.length === 0) return [[dayStart, dayEnd]];

	const slots: Array<[number, number]> = [];
	if (intervals[0].start > dayStart) slots.push([dayStart, intervals[0].start]);

	for (let i = 0; i < intervals.length - 1; i++) {
		const curEnd = intervals[i].end;
		const nextStart = intervals[i + 1].start;
		if (nextStart > curEnd) slots.push([curEnd, nextStart]);
	}

	const lastEnd = intervals[intervals.length - 1].end;
	if (lastEnd < dayEnd) slots.push([lastEnd, dayEnd]);

	return slots;
}

/** Produce every candidate start time (in minutes) in each free interval */
function generateCandidates(
	freeIntervals: Array<[number, number]>,
	duration: number,
	step: number
): Candidate[] {
	return freeIntervals.flatMap(([start, end]) => {
		const cands: Candidate[] = [];
		for (let s = start; s + duration <= end; s += step) {
			cands.push({
				slotStart: s,
				slotEnd: s + duration,
				freeStart: start,
				freeEnd: end,
			});
		}
		return cands;
	});
}

/** Classify one candidate into strict, soft, or bad (with reason) */
function classifySlot(c: Candidate, minGapMinutes: number): ClassifiedSlot {
	const { slotStart, slotEnd, freeStart, freeEnd } = c;
	const gapBefore = slotStart - freeStart;
	const gapAfter = freeEnd - slotEnd;
	const fillsFromStart = slotStart === freeStart;
	const fillsToEnd = slotEnd === freeEnd;

	const alignedBefore = gapBefore % 60 === 0 || gapBefore % 90 === 0;
	const alignedAfter = gapAfter % 60 === 0 || gapAfter % 90 === 0;

	// STRICT: abuts free interval boundary
	if (fillsFromStart || fillsToEnd || alignedBefore || alignedAfter) {
		return { kind: "strict", slot: minutesToHhmm(slotStart) };
	}

	//TODO refactor
	// SOFT: one‐side fill, aligned, and leaves an unfillable gap (< minGap)
	if (
		(alignedBefore || alignedAfter) &&
		((gapBefore < minGapMinutes && fillsFromStart) ||
			(gapAfter < minGapMinutes && fillsToEnd))
	) {
		return { kind: "soft", slot: minutesToHhmm(slotStart) };
	}

	// BAD: leaves too much bookable time (i.e. ≥ minGap) or two small gaps
	const reason = `Leaves unusable gaps: ${gapBefore} min before, ${gapAfter} min after.`;
	return { kind: "bad", slot: minutesToHhmm(slotStart), reason };
}

/** Partition an array of ClassifiedSlot into our three named buckets */
function partitionSlots(classified: ClassifiedSlot[]): SlotClassification {
	return classified.reduce<SlotClassification>(
		(acc, cur) => {
			if (cur.kind === "strict") acc.strict.push(cur.slot);
			else if (cur.kind === "soft") acc.soft.push(cur.slot);
			else {
				acc.bad.push(cur.slot);
				acc.badReasons[cur.slot] = cur.reason!;
			}
			return acc;
		},
		{ strict: [], soft: [], bad: [], badReasons: {} }
	);
}

/** Helpers to convert between "HH:mm" and minutes-since-midnight */
function hhmmToMinutes(hhmm: string): number {
	const [h, m] = hhmm.split(":").map(Number);
	return h * 60 + m;
}
function minutesToHhmm(minutes: number): string {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
// ---- Example usage ----

// const bookings = [
// 	{ start: "09:00", end: "10:00" },
// 	{ start: "12:00", end: "14:00" },
// 	{ start: "15:30", end: "16:15" },
// ];
// const bookings = [
// 	{ start: "08:00", end: "9:30" },
// 	{ start: "10:00", end: "11:00" },
// ];

// const duration = 90;
// const minGap = 60;

// const slots = findBestScheduleSlots(duration, bookings, minGap);
// console.log("STRICT:", slots.strict);

// console.log("SOFT:", slots.soft);
// console.log("BAD:", slots.bad);
// console.log("BAD REASONS:", slots.badReasons);

const bookings = [
	{ therapistId: "A", start: "08:00", end: "09:30", durationMinutes: 90 },
	{ therapistId: "A", start: "10:00", end: "11:00", durationMinutes: 60 },
	{ therapistId: "B", start: "08:00", end: "09:00", durationMinutes: 90 },
	{ therapistId: "B", start: "10:00", end: "11:00", durationMinutes: 60 },
];

function groupBookingsByTherapist(bookings: BookingIntervalWithTherapist[]) {
	return Object.values(
		bookings.reduce(
			(
				acc: Record<
					string,
					{
						therapistId: string;
						bookings: BookingIntervalWithTherapist[];
					}
				>,
				{ therapistId, ...rest }
			) => {
				if (!acc[therapistId]) acc[therapistId] = { therapistId, bookings: [] };
				acc[therapistId].bookings.push(rest);
				return acc;
			},
			{}
		)
	);
}

export const findBestScheduleSlotsForAll = (
	bookings: BookingIntervalWithTherapist[],
	duration: number = 60
) => {
	const groupedBookings = groupBookingsByTherapist(bookings);
	const totalSlots = [];
	for (const therapist of groupedBookings) {
		const slotsForEachTherapist = findBestScheduleSlots(
			duration,
			therapist.bookings
		);
		totalSlots.push({ therapist: therapist, bestSlots: slotsForEachTherapist });
	}

	return totalSlots;
};

findBestScheduleSlotsForAll(bookings);
