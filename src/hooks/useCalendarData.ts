import type { Booking } from "../types";

export function useCalendarData(bookings: Booking[], date: Date) {
  const dateStr = date.toISOString().split("T")[0];

  const bookingsForDay = bookings.filter((b) => b.date === dateStr);

  const startHour = 8;
  const endHour = 19;
  const slots = Array.from(
    { length: (endHour - startHour) * 4 },
    (_, i) => startHour + i * 0.25 // 15-minute increments
  );

  const getBookingsAtSlot = (hour: number) =>
    bookingsForDay.filter((b) => b.startTime === hour);

  return {
    slots,
    bookingsForDay,
    getBookingsAtSlot,
  };
}
