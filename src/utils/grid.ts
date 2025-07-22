
import type { Booking } from "../types";

export const generateIntervalSlots = (start: number, end: number, interval: number) => {
    return Array.from(
      { length: (end - start) * (60 / interval) },
      (_, i) => start + (i * interval) / 60
    )
}
export const groupByTherapist = (bookings: Booking[]) => {
    return bookings.reduce<Record<string, Booking[]>>((acc, b) => {
        (acc[b.therapistId] ||= []).push(b);
        return acc;
    }, {})
}