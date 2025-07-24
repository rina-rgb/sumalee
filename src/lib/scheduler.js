/**
 * Find and classify all possible appointment slots for a given day,
 * returning strict, soft, and bad (with reasons) buckets.
 *
 * @param {number} durationMinutes - Appointment duration in minutes.
 * @param {Array} bookings - Existing bookings (with {start, end} as 'HH:mm').
 * @param {number} minGapMinutes - Minimum allowed gap between appointments.
 * @param {string} dayStartStr - Start of day (default '08:00').
 * @param {string} dayEndStr - End of day (default '18:00').
 * @returns {Object} { strict, soft, bad, badReasons }
 */
function findBestScheduleSlots(
	durationMinutes,
	bookings,
	minGapMinutes = 60,
	dayStartStr = "08:00",
	dayEndStr = "18:00"
) {
	const dayStart = hhmmToMinutes(dayStartStr);
	const dayEnd = hhmmToMinutes(dayEndStr);

	const intervals = bookingsToIntervals(bookings);
	const freeIntervals = getFreeIntervals(intervals, dayStart, dayEnd);
	const candidates = generateCandidates(freeIntervals, durationMinutes, 15);

	const classified = candidates.map((c) =>
		classifySlot(c, durationMinutes, minGapMinutes)
	);

	return partitionSlots(classified);
}

/* ---------- Helpers Below ---------- */

// Converts bookings with {start, end} as "HH:mm" to intervals in minutes.
function bookingsToIntervals(bookings) {
	return bookings
		.map(({ start, end }) => ({
			start: hhmmToMinutes(start),
			end: hhmmToMinutes(end),
		}))
		.sort((a, b) => a.start - b.start);
}

// Finds all free intervals [start, end) in minutes between bookings and the workday.
function getFreeIntervals(intervals, dayStart, dayEnd) {
	if (!intervals.length) return [[dayStart, dayEnd]];
	const slots = [];
	if (intervals[0].start > dayStart) slots.push([dayStart, intervals[0].start]);
	for (let i = 0; i < intervals.length - 1; i++) {
		if (intervals[i + 1].start > intervals[i].end)
			slots.push([intervals[i].end, intervals[i + 1].start]);
	}
	if (intervals[intervals.length - 1].end < dayEnd)
		slots.push([intervals[intervals.length - 1].end, dayEnd]);
	return slots;
}

// Generates all possible candidate slot starts within each free interval.
function generateCandidates(freeIntervals, duration, step = 15) {
	return freeIntervals.flatMap(([start, end]) => {
		const candidates = [];
		for (let s = start; s + duration <= end; s += step) {
			candidates.push({
				slotStart: s,
				slotEnd: s + duration,
				freeStart: start,
				freeEnd: end,
			});
		}
		return candidates;
	});
}

// Classifies a slot as strict, soft, or bad, including reasoning for bad.
function classifySlot(
	{ slotStart, slotEnd, freeStart, freeEnd },
	duration,
	minGap
) {
	const gapBefore = slotStart - freeStart;
	const gapAfter = freeEnd - slotEnd;
	const fillsFromStart = slotStart === freeStart;
	const fillsToEnd = slotEnd === freeEnd;
	const minutesPart = slotStart % 60;
	const aligned = minutesPart === 0 || minutesPart === 30;

	// STRICT: slot abuts free interval (minimize wasted time)
	if (fillsFromStart || fillsToEnd)
		return { kind: "strict", slot: minutesToHhmm(slotStart) };

	// SOFT: slot fills only one side, and is :00 or :30 aligned
	if (
		aligned &&
		((gapBefore < duration && fillsFromStart) ||
			(gapAfter < duration && fillsToEnd))
	)
		return { kind: "soft", slot: minutesToHhmm(slotStart) };

	// BAD: leaves two small gaps or a bookable gap
	let reason = `Leaves unusable gaps: ${gapBefore} min before, ${gapAfter} min after.`;
	if (gapBefore >= duration)
		reason = `Leaves bookable gap of ${gapBefore} min before (not allowed).`;
	else if (gapAfter >= duration)
		reason = `Leaves bookable gap of ${gapAfter} min after (not allowed).`;
	return {
		kind: "bad",
		slot: minutesToHhmm(slotStart),
		reason,
	};
}

// Groups classified slots into strict/soft/bad buckets with reasons.
function partitionSlots(classified) {
	return classified.reduce(
		(acc, cur) => {
			if (cur.kind === "strict") acc.strict.push(cur.slot);
			else if (cur.kind === "soft") acc.soft.push(cur.slot);
			else {
				acc.bad.push(cur.slot);
				acc.badReasons[cur.slot] = cur.reason;
			}
			return acc;
		},
		{ strict: [], soft: [], bad: [], badReasons: {} }
	);
}

// Converts "HH:mm" to minutes past midnight.
function hhmmToMinutes(hhmm) {
	const [h, m] = hhmm.split(":").map(Number);
	return h * 60 + m;
}

// Converts minutes past midnight to "HH:mm".
function minutesToHhmm(minutes) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ---- Example usage ----

const bookings = [
	{ start: "09:00", end: "10:00" },
	{ start: "12:00", end: "14:00" },
	{ start: "15:30", end: "16:15" },
];

const duration = 90;
const minGap = 60;

const slots = findBestScheduleSlots(duration, bookings, minGap);
console.log("STRICT:", slots.strict);
console.log("SOFT:", slots.soft);
console.log("BAD:", slots.bad);
console.log("BAD REASONS:", slots.badReasons);
