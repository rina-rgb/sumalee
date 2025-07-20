import { useState } from "react";
import type { Booking } from "../types";

type ModalPayload =
  | { type: "new"; time: number; therapistId: string }
  | { type: "edit"; bookingId: string };

export function useBookings(currentDate: Date) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [bookingData, setBookingData] = useState<(Booking & { type: "new" | "edit" }) | null>(null);

  const openModal = (payload: ModalPayload) => {
    if (payload.type === "edit") {
      const existing = bookings.find((b) => b.id === payload.bookingId);
      if (!existing) return;
      setBookingData({ ...existing, type: "edit" });
    } else {
      setBookingData({
        id: crypto.randomUUID(),
        type: "new",
        startTime: payload.time,
        therapistId: payload.therapistId,
        date: currentDate.toISOString().split("T")[0],
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        durationMinutes: 0,
        notes: "",
      });
    }

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setBookingData(null);
  };

  const handleFormAction = (formData: FormData) => {
    if (!bookingData) return;

    const updated: Booking = {
      ...bookingData,
      firstName: formData.get("first_name") as string,
      lastName: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      durationMinutes: Number(formData.get("duration")),
      notes: formData.get("notes") as string,
    };

    setBookings((prev) => [
      ...prev.filter((b) => b.id !== updated.id),
      updated,
    ]);

    closeModal();
  };

  return {
    bookings,
    isOpen,
    bookingData,
    openModal,
    closeModal,
    handleFormAction,
  };
}
