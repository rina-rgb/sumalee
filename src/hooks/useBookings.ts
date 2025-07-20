import { useState } from "react";
import type { Booking } from "../types";

export function useBookings(currentDate: Date) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // NEW

  const openModal = (payload: number | Booking) => {
    if (typeof payload === "number") {
      setSelectedTimeSlot(payload);
      setSelectedBooking(null);
    } else {
      setSelectedTimeSlot(payload.startTime);
      setSelectedBooking(payload);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedTimeSlot(null);
    setSelectedBooking(null);
  };

  const handleFormAction = (formData: FormData) => {
    if (selectedTimeSlot === null) return;

    const newBooking: Booking = {
      firstName: formData.get("first_name") as string,
      lastName: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      startTime: selectedTimeSlot,
      durationMinutes: Number(formData.get("duration")),
      notes: formData.get("notes") as string,
      date: currentDate.toISOString().split("T")[0],
    };

    setBookings((prev) => {
      const updated = prev.filter(
        (b) => !(b.startTime === selectedTimeSlot && b.date === newBooking.date)
      );
      return [...updated, newBooking];
    });

    closeModal();
  };

  return {
    bookings,
    isOpen,
    selectedTimeSlot,
    selectedBooking, // expose this
    openModal,
    closeModal,
    handleFormAction,
  };
}
