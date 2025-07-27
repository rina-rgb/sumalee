import { useCallback } from "react";
import { calculateEndTime } from "../utils/time";
import { useBookings } from "./useBookings";
import type { Booking } from "../types/domain";

export function useDragToMove(currentDate: Date) {
	const { bookings, updateBooking } = useBookings(currentDate);

	// memoize so your DnDContext handler can stay referentially stable
	return useCallback(
		(bookingId: string, newTherapistId: string, newStart: string) => {
			console.log("useDragToMove called:", { 
				bookingId, 
				newTherapistId, 
				newStart, 
				currentDate: currentDate.toISOString().split('T')[0],
				availableBookings: bookings.map(b => ({ id: b.id, date: b.date }))
			});
			
			// find the original booking
			const original = bookings.find((b) => b.id === bookingId);
			if (!original) {
				console.warn(`Booking ${bookingId} not found in bookings for date ${currentDate}`);
				console.warn("Available bookings:", bookings);
				return;
			}

			// compute the new end time
			const newEnd = calculateEndTime(newStart, original.durationMinutes);

			// fire your existing updateBooking
			updateBooking({
				...original,
				therapistId: newTherapistId,
				start: newStart,
				end: newEnd,
			} as Booking);
		},
		[bookings, updateBooking]
	);
}
