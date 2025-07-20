import { useState } from "react";
import type { Booking } from "../types";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const saveBooking = (booking: Booking) => {
    setBookings((prev) => {
      // Remove existing booking with same ID (if updating)
      const filtered = prev.filter(b => b.id !== booking.id);
      // Add new/updated booking and sort
      return [...filtered, booking].sort((a, b) => a.startTime - b.startTime);
    });
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter(b => b.id !== id));
  };

  const getBooking = (id: string) => {
    return bookings.find(b => b.id === id);
  };

  return {
    bookings,
    saveBooking,  // Single function for both add and update
    deleteBooking,
    getBooking,
  };
}