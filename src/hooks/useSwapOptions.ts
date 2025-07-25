import { useMemo } from "react";
import { proposeSwapOptions, SwapProposal } from "../lib/proposeSwapOptions";
import type { Booking } from "../types/domain";

interface UseSwapOptionsParams {
	minGapMinutes?: number;
	dayStart?: string;
	dayEnd?: string;
}

/**
 * React hook to compute swap proposals for a desired duration.
 */
export function useSwapOptions(
	bookings: Booking[],
	duration: number,
	options: UseSwapOptionsParams = {}
): SwapProposal[] {
	const { minGapMinutes = 60, dayStart = "08:00", dayEnd = "18:00" } = options;
	return useMemo(
		() =>
			proposeSwapOptions(bookings, duration, minGapMinutes, dayStart, dayEnd),
		[bookings, duration, minGapMinutes, dayStart, dayEnd]
	);
}
