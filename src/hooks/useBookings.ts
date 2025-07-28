import useSWR from "swr";
import type { Booking } from "../types";
import { fetcher } from "../lib/fetcher";

export function useBookings(currentDate: Date) {
	// Safety check: if currentDate is undefined, use today's date
	const safeDate = currentDate || new Date();
	const dateStr = safeDate.toISOString().slice(0, 10);

	const {
		data: bookings,
		error,
		isLoading,
		mutate,
	} = useSWR<Booking[]>(
		["/api/bookings", dateStr], // point to your FastAPI backend
		async ([url, date]) => {
			const all = (await fetcher(url)) as Booking[];
			return all.filter((b) => b.date === date);
		}
	);

	const addBooking = async (newBooking: Booking) => {
		try {
			await mutate([...(bookings ?? []), newBooking], false);
		} catch (error) {
			console.error("Failed to add booking:", error);
		}
	};

	const updateBooking = async (edited: Booking) => {
		try {
			await mutate(
				(bookings ?? []).map((b) => (b.id === edited.id ? edited : b)),
				false
			);
		} catch (error) {
			console.error("Failed to update booking:", error);
		}
	};

	return {
		bookings: bookings ?? [],
		addBooking,
		updateBooking,
		isLoading,
		isError: Boolean(error),
	};
}
