import { useMemo } from "react";
import type { Booking } from "../types";

const START_HOUR = 8;
const END_HOUR = 19;

/**
 * A custom hook to encapsulate the logic for building the calendar grid.
 *
 * @returns An object containing the time slots for the grid and a function
 * to group bookings by therapist.
 */
export function useCalendarGrid() {
  // 1) Build the 15-minute time slots for the grid.
  // This is memoized because it only needs to be calculated once.
  const slots = useMemo(
    () =>
      Array.from(
        { length: (END_HOUR - START_HOUR) * 4 },
        (_, i) => START_HOUR + i * 0.25
      ),
    []
  );

  // 2) A memoized function to group bookings by therapist ID.
  // This prevents re-calculation on every render unless bookings change.
  const groupBookingsByTherapist = useMemo(
    () => (bookings: Booking[]) => {
      return bookings.reduce<Record<string, Booking[]>>((acc, b) => {
        (acc[b.therapistId] ||= []).push(b);
        return acc;
      }, {});
    },
    []
  );

  return { slots, groupBookingsByTherapist };
} 