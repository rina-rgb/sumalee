import { useState } from "react";
import type { Booking } from "../types";

export function useBookings(currentDate: Date) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);

  const openModal = (time: number) => {
    setSelectedTimeSlot(time);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedTimeSlot(null);
    setIsOpen(false);
  };

  const handleFormAction = (formData: FormData) => {
    if (selectedTimeSlot === null) return;

    //get info from current input fields
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
        (b) =>
          !(b.startTime === selectedTimeSlot &&
            b.date === newBooking.date)
      );
      return [...updated, newBooking];
    });

    closeModal();
  };

  return {
    bookings,
    isOpen,
    selectedTimeSlot,
    openModal,
    closeModal,
    handleFormAction,
  };
}
