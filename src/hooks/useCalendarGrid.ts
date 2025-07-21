import { useMemo } from "react";
import { TIME_GRID_BASE_HOUR, TIME_GRID_INTERVAL_MINUTES, TIME_GRID_END_HOUR } from "../utils/constants";
import type { Booking } from "../types";

const START_HOUR = TIME_GRID_BASE_HOUR;
const END_HOUR = TIME_GRID_END_HOUR;

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
        { length: (END_HOUR - START_HOUR) * (60 / TIME_GRID_INTERVAL_MINUTES) },
        (_, i) => START_HOUR + (i * TIME_GRID_INTERVAL_MINUTES) / 60
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