import { useState } from "react";
import type { Booking, BookingModalData } from "../types";

export function useBookingModal() {
  const [modalState, setModalState] = useState<BookingModalData>({
    isOpen: false,
    bookingData: {},
  });

  const openNewBooking = (time: number, therapistId: string, date: string) => {
    setModalState({
      isOpen: true,
      bookingData: {
        startTime: time,
        therapistId,
        date,
      },
    });
  };

  const openEditBooking = (booking: Booking) => {
    setModalState({
      isOpen: true,
      editingId: booking.id,
      bookingData: booking,
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, bookingData: {} });
  };

  const createBookingFromForm = (formData: FormData): Booking => {
    return {
      id: modalState.editingId || crypto.randomUUID(),
      date: modalState.bookingData.date!,
      startTime: modalState.bookingData.startTime!,
      therapistId: modalState.bookingData.therapistId!,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      durationMinutes: Number(formData.get("durationMinutes")),
      notes: formData.get("notes") as string || "",
    };
  };

  return {
    modalState,
    openNewBooking,
    openEditBooking,
    closeModal,
    createBookingFromForm,
    isEditing: !!modalState.editingId,
  };
}