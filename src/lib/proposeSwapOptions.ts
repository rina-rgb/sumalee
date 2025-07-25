import { findBestScheduleSlots } from "./slotfinder";
import type { Booking } from "../types/domain";
import { groupByTherapist } from "../utils/grid";

export interface SwapProposal {
	slot: string; // e.g. "09:00"
	therapistId: string; // therapist who would now be available at that slot
	swapOut: Booking; // booking to remove from that therapist
	swapIn: Booking; // booking to move onto that therapist
	kind: "strict" | "soft";
}

function toMinutes(hhmm: string): number {
	const [h, m] = hhmm.split(":").map(Number);
	return h * 60 + m;
}

function overlaps(test: Booking, others: Booking[]): boolean {
	const ts = toMinutes(test.start);
	const te = toMinutes(test.end);
	return others.some((b) => {
		if (b.id === test.id) return false;
		const bs = toMinutes(b.start);
		const be = toMinutes(b.end);
		return bs < te && ts < be;
	});
}

export function proposeSwapOptions(
	bookings: Booking[],
	duration: number,
	minGapMinutes: number = 60,
	dayStart: string = "08:00",
	dayEnd: string = "18:00"
): SwapProposal[] {
	const byTherapist = groupByTherapist(bookings);
	const therapistIds = Object.keys(byTherapist);
	const proposals: SwapProposal[] = [];
	const seen = new Set<string>();

	for (const tA of therapistIds) {
		for (const tB of therapistIds) {
			if (tA === tB) continue;
			const aBookings = byTherapist[tA];
			const bBookings = byTherapist[tB];
			for (const a of aBookings) {
				for (const b of bBookings) {
					// swap a<->b
					const newA = aBookings
						.filter((x) => x.id !== a.id)
						.concat({ ...b, therapistId: tA });
					const newB = bBookings
						.filter((x) => x.id !== b.id)
						.concat({ ...a, therapistId: tB });
					// check overlap
					if (overlaps(b, newA)) continue;
					if (overlaps(a, newB)) continue;
					// compute slots
					const beforeA = findBestScheduleSlots(
						duration,
						aBookings.map((x) => ({ start: x.start, end: x.end })),
						minGapMinutes,
						dayStart,
						dayEnd
					);
					const afterA = findBestScheduleSlots(
						duration,
						newA.map((x) => ({ start: x.start, end: x.end })),
						minGapMinutes,
						dayStart,
						dayEnd
					);
					const beforeB = findBestScheduleSlots(
						duration,
						bBookings.map((x) => ({ start: x.start, end: x.end })),
						minGapMinutes,
						dayStart,
						dayEnd
					);
					const afterB = findBestScheduleSlots(
						duration,
						newB.map((x) => ({ start: x.start, end: x.end })),
						minGapMinutes,
						dayStart,
						dayEnd
					);
					// DEBUG for Example1 swap A(a2)->B(b2)
					if (tA === "A" && tB === "B" && a.id === "a2" && b.id === "b2") {
						console.log(
							"DEBUG beforeB.strict/soft:",
							beforeB.strict,
							beforeB.soft
						);
						console.log(
							"DEBUG afterB.strict/soft:",
							afterB.strict,
							afterB.soft
						);
					}
					// Helper to compute free intervals in minutes
					function getFreeIntervalsMin(
						bookingsArr: Booking[]
					): Array<[number, number]> {
						const ints = bookingsArr
							.map(
								(x) =>
									[toMinutes(x.start), toMinutes(x.end)] as [number, number]
							)
							.sort((a, b) => a[0] - b[0]);
						const res: [number, number][] = [];
						const ds = toMinutes(dayStart),
							de = toMinutes(dayEnd);
						if (ints.length === 0) {
							res.push([ds, de]);
						} else {
							if (ints[0][0] > ds) res.push([ds, ints[0][0]]);
							for (let k = 0; k < ints.length - 1; ++k) {
								const endK = ints[k][1],
									startN = ints[k + 1][0];
								if (startN > endK) res.push([endK, startN]);
							}
							const lastEnd = ints[ints.length - 1][1];
							if (lastEnd < de) res.push([lastEnd, de]);
						}
						return res;
					}
					// Propose for tB
					{
						const freeIntsB = getFreeIntervalsMin(newB);
						const allSlotsB = Array.from(
							new Set([...afterB.strict, ...afterB.soft])
						);
						for (const slot of allSlotsB) {
							if (beforeB.strict.includes(slot) || beforeB.soft.includes(slot))
								continue;
							let kind: "strict" | "soft" = afterB.strict.includes(slot)
								? "strict"
								: "soft";
							// override: if slot fills to end but does not fill from start, treat as soft
							const sMin = toMinutes(slot),
								eMin = sMin + duration;
							const fi = freeIntsB.find(([s, e]) => sMin >= s && eMin <= e);
							if (kind === "strict" && fi && sMin !== fi[0] && eMin === fi[1]) {
								kind = "soft";
							}
							const key = `${tB}@${slot}@${a.id}@${b.id}`;
							if (!seen.has(key)) {
								proposals.push({
									slot,
									therapistId: tB,
									swapOut: b,
									swapIn: a,
									kind,
								});
								seen.add(key);
							}
						}
					}
					// proposals for tA
					{
						const freeIntsA = getFreeIntervalsMin(newA);
						const allSlotsA = Array.from(
							new Set([...afterA.strict, ...afterA.soft])
						);
						for (const slot of allSlotsA) {
							if (beforeA.strict.includes(slot) || beforeA.soft.includes(slot))
								continue;
							let kind: "strict" | "soft" = afterA.strict.includes(slot)
								? "strict"
								: "soft";
							const sMin = toMinutes(slot),
								eMin = sMin + duration;
							const fi = freeIntsA.find(([s, e]) => sMin >= s && eMin <= e);
							if (kind === "strict" && fi && sMin !== fi[0] && eMin === fi[1]) {
								kind = "soft";
							}
							const key = `${tA}@${slot}@${b.id}@${a.id}`;
							if (!seen.has(key)) {
								proposals.push({
									slot,
									therapistId: tA,
									swapOut: a,
									swapIn: b,
									kind,
								});
								seen.add(key);
							}
						}
					}
				}
			}
		}
	}
	return proposals;
}

// ----------------- TESTS -----------------
function assert(cond: boolean, msg: string) {
	if (!cond) throw new Error(msg);
}

function runTests() {
	// Example 1
	const b1: Booking[] = [
		{
			id: "a1",
			therapistId: "A",
			start: "08:00",
			end: "09:30",
			durationMinutes: 90,
			date: "2023-01-01",
			service: "t",
			createdAt: "2023-01-01T00:00:00Z",
		},
		{
			id: "a2",
			therapistId: "A",
			start: "10:30",
			end: "11:30",
			durationMinutes: 60,
			date: "2023-01-01",
			service: "t",
			createdAt: "2023-01-01T00:00:00Z",
		},
		{
			id: "a3",
			therapistId: "A",
			start: "12:30",
			end: "13:30",
			durationMinutes: 90,
			date: "2023-01-01",
			service: "t",
			createdAt: "2023-01-01T00:00:00Z",
		},
		{
			id: "b1",
			therapistId: "B",
			start: "08:00",
			end: "09:00",
			durationMinutes: 60,
			date: "2023-01-01",
			service: "t",
			createdAt: "2023-01-01T00:00:00Z",
		},
		{
			id: "b2",
			therapistId: "B",
			start: "09:30",
			end: "11:00",
			durationMinutes: 90,
			date: "2023-01-01",
			service: "t",
			createdAt: "2023-01-01T00:00:00Z",
		},
		{
			id: "b3",
			therapistId: "B",
			start: "12:00",
			end: "13:00",
			durationMinutes: 60,
			date: "2023-01-01",
			service: "t",
			createdAt: "2023-01-01T00:00:00Z",
		},
	];
	const out1 = proposeSwapOptions(b1, 90);
	assert(
		out1.some(
			(p) => p.slot === "09:00" && p.therapistId === "B" && p.kind === "strict"
		),
		"Missing B 09:00 strict"
	);
	assert(
		out1.some(
			(p) => p.slot === "11:00" && p.therapistId === "A" && p.kind === "strict"
		),
		"Missing A 11:00 strict"
	);

	// Example 2
	const b2: Booking[] = [
		{
			id: "a1",
			therapistId: "A",
			start: "08:00",
			end: "09:30",
			durationMinutes: 90,
			date: "2023-01-01",
			service: "t",
			createdAt: "t",
		},
		{
			id: "a2",
			therapistId: "A",
			start: "10:00",
			end: "11:00",
			durationMinutes: 60,
			date: "2023-01-01",
			service: "t",
			createdAt: "t",
		},
		{
			id: "b1",
			therapistId: "B",
			start: "08:00",
			end: "09:30",
			durationMinutes: 90,
			date: "2023-01-01",
			service: "t",
			createdAt: "t",
		},
		{
			id: "b2",
			therapistId: "B",
			start: "10:00",
			end: "11:00",
			durationMinutes: 60,
			date: "2023-01-01",
			service: "t",
			createdAt: "t",
		},
	];
	const out2 = proposeSwapOptions(b2, 90);
	assert(out2.length === 0, "Expected no swaps");

	// Example 3
	const b3: Booking[] = [
		{
			id: "a1",
			therapistId: "A",
			start: "09:00",
			end: "10:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
		{
			id: "a2",
			therapistId: "A",
			start: "12:00",
			end: "13:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
		{
			id: "b1",
			therapistId: "B",
			start: "10:00",
			end: "11:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
	];
	const out3 = proposeSwapOptions(b3, 120);
	assert(
		out3.some((p) => p.slot === "10:00" && p.kind === "soft"),
		"Expected 10:00 soft"
	);

	// Example 4
	const b4: Booking[] = [
		{
			id: "a1",
			therapistId: "A",
			start: "08:00",
			end: "09:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
		{
			id: "b1",
			therapistId: "B",
			start: "09:00",
			end: "10:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
	];
	const out4 = proposeSwapOptions(b4, 60);
	assert(out4.length === 0, "Expected no overlap swaps");

	// Example 5
	const b5: Booking[] = [
		{
			id: "a1",
			therapistId: "A",
			start: "08:00",
			end: "09:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
		{
			id: "a2",
			therapistId: "A",
			start: "09:30",
			end: "10:30",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
		{
			id: "b1",
			therapistId: "B",
			start: "08:00",
			end: "09:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
		{
			id: "b2",
			therapistId: "B",
			start: "10:00",
			end: "11:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
		{
			id: "c1",
			therapistId: "C",
			start: "09:00",
			end: "10:00",
			durationMinutes: 60,
			date: "d",
			service: "t",
			createdAt: "t",
		},
	];
	const out5 = proposeSwapOptions(b5, 60);
	assert(Array.isArray(out5), "Expected array");

	console.log("All proposeSwapOptions tests passed.");
}

// Run tests
runTests();
