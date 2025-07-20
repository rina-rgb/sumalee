import { useState } from "react";
import type { Booking } from "../types"
type SelectedTimeSlot = { time: number; therapistId: string } | null;

export function useBookings(currentDate: Date) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<SelectedTimeSlot>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // NEW

  function isBooking(payload: unknown): payload is Booking {
    return (
      typeof payload === "object" &&
      payload !== null &&
      "startTime" in payload
    );
  }
  
  const openModal = (payload: SelectedTimeSlot | Booking) => {
    if (isBooking(payload)) {
      setSelectedTimeSlot({
        time: payload.startTime,
        therapistId: payload.therapistId,
      });
      setSelectedBooking(payload);
    } else {
      setSelectedTimeSlot(payload);
      setSelectedBooking(null);
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
      startTime: selectedTimeSlot.time,
      durationMinutes: Number(formData.get("duration")),
      notes: formData.get("notes") as string,
      date: currentDate.toISOString().split("T")[0],
      therapistId: selectedTimeSlot.therapistId
    };

    setBookings((prev) => {
      const updated = prev.filter(
        (b) => !(b.startTime === selectedTimeSlot.time && b.date === newBooking.date)
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
