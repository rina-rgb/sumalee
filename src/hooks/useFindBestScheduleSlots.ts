import { useMemo } from "react";
import { findBestScheduleSlotsForAll } from "../lib/slotfinder";
import { Booking } from "../types/domain";

export default function useFindBestScheduleSlots(
	bookings: Booking[],
	duration: number
) {
	return useMemo(
		() => findBestScheduleSlotsForAll(bookings, duration),
		[bookings, duration]
	);
}
