import useSWR from "swr";
import type { Booking } from "../types";
import { fetcher } from "../lib/fetcher";

export function useBookings(currentDate: Date) {
  const dateStr = currentDate.toISOString().slice(0, 10);

  // The SWR key is now an array. It includes the date, so SWR will
  // fetch and cache data on a per-day basis.
  const {
    data: bookings,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<Booking[]>(
    ["/bookings.json", dateStr],
    // This custom fetcher simulates a network call that filters by date.
    async ([url, date]) => {
      const allBookings = (await fetcher(url)) as Booking[];
      return allBookings.filter((b) => b.date === date);
    }
  );

  /**
   * To optimistically update, we now need to be more careful. We can't
   * just update the local `bookings` data, because that only affects
   * one day's cache. We need a way to tell SWR how to update other
   * cache keys. SWR's `mutate` is smart enough to handle this: when we
   * update the data for our current key, it will find other keys that
   * also include `/bookings.json` and attempt to revalidate or update them.
   * For this local-only demo, we'll keep it simple, but in a real app
   * you might need more advanced cache mutation strategies.
   */
  const addBooking = async (newBooking: Booking) => {
    try {
      // Optimistically add to the current day's cache.
      await mutate([...(bookings ?? []), newBooking], false);
    } catch (error) {
      console.error("Failed to add booking:", error);
    }
  };

  const updateBooking = async (edited: Booking) => {
    try {
      // Optimistically update the current day's cache.
      await mutate(
        (bookings ?? []).map((b) => (b.id === edited.id ? edited : b)),
        false
      );
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };
  /**
   * Remove a booking by ID (optimistically).
   */
  const deleteBooking = async (id: string) => {
    try {
      const updated = (bookings ?? []).filter((b) => b.id !== id);
      await mutate(updated, false);
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  /**
   * Find one booking in today’s list.
   */
  const getBooking = (id: string) => bookings?.find((b) => b.id === id);

  return {
    bookings: bookings ?? [],
    addBooking,
    updateBooking,
    deleteBooking,
    getBooking,
    isLoading,
    isValidating,
    isError: Boolean(error),
    revalidate: mutate,
  };
}
