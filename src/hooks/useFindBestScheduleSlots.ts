import useSWR from "swr";
import { Booking } from "../types/domain";

/**
 * React hook to compute slot suggestions from the FastAPI backend.
 */
export default function useFindBestScheduleSlots(
	bookings: Booking[],
	duration: number
) {
	const shouldFetch = bookings.length > 0;

	const { data, error, isLoading } = useSWR(
		shouldFetch ? ["slot-suggestions", bookings, duration] : null,
		async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/find-best-slots`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ bookings, duration }),
				}
			);
			if (!res.ok) throw new Error("Failed to fetch slot suggestions");
			return res.json();
		}
	);

	return {
		suggestions: data ?? [],
		isLoading,
		isError: !!error,
	};
}
