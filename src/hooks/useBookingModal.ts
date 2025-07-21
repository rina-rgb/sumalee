// useBookingModal.ts
import { useState, useCallback } from "react";
import { calculateEndTime, formatHour } from "../utils/time";
import type { Booking, ModalPayload } from "../types";
import type { AppointmentFormFields, CustomerFormFields } from "../types/forms";

// Define the shape of the modal's state
interface BookingModalState {
  id: string | null;
  isOpen: boolean;
  isEditing: boolean;
  customerFields: CustomerFormFields;
  appointmentFields: AppointmentFormFields;
}

// Initial state for the modal
const initialModalState: BookingModalState = {
  id: null,
  isOpen: false,
  isEditing: false,
  customerFields: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  appointmentFields: {
    service: "",
    durationMinutes: 60,
    notes: "",
    start: "",
    end: "",
    date: "",
    therapistId: "",
  },
};

export function useBookingModal(
  currentDate: Date,
  addBooking: (booking: Booking) => Promise<void>,
  updateBooking: (booking: Booking) => Promise<void>
) {
  const [modalState, setModalState] =
    useState<BookingModalState>(initialModalState);

  const openModal = useCallback((payload: ModalPayload) => {
    if (payload.type === "edit") {
      const { booking } = payload;
      setModalState({
        id: booking.id,
        isOpen: true,
        isEditing: true,
        customerFields: {
          id: booking.customer?.id ?? "",
          firstName: booking.customer?.firstName ?? "",
          lastName: booking.customer?.lastName ?? "",
          email: booking.customer?.email ?? "",
          phone: booking.customer?.phone ?? "",
        },
        appointmentFields: {
          service: booking.service,
          durationMinutes: booking.durationMinutes,
          notes: booking.notes || "",
          start: booking.start,
          end: booking.end,
          date: booking.date,
          therapistId: booking.therapistId,
        },
      });
    } else {
      const start = formatHour(payload.time);
      const duration = 60;
      const end = calculateEndTime(start, duration);
      setModalState({
        id: null,
        isOpen: true,
        isEditing: false,
        customerFields: initialModalState.customerFields,
        appointmentFields: {
          service: "",
          durationMinutes: duration,
          notes: "",
          start,
          end,
          date: currentDate.toISOString().split("T")[0],
          therapistId: payload.therapistId,
        },
      });
    }
  }, [currentDate]);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      const [group, key] = name.split(".");

      if (group === "customer" || group === "appointment") {
        setModalState((prev) => ({
          ...prev,
          [`${group}Fields`]: {
            ...prev[`${group}Fields`],
            [key]: value,
          },
        }));
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { isEditing, appointmentFields, customerFields, id } = modalState;

      const bookingData: Booking = {
        id: isEditing && id ? id : `new-${Date.now()}`,
        ...appointmentFields,
        customer: { ...customerFields },
        createdAt: new Date().toISOString(),
        end: calculateEndTime(
          appointmentFields.start,
          Number(appointmentFields.durationMinutes)
        ),
      };
      if (isEditing) {
        await updateBooking(bookingData);
      } else {
        await addBooking(bookingData);
      }
      closeModal();
    },
    [modalState, addBooking, updateBooking, closeModal]
  );

  return {
    modalState,
    openModal,
    closeModal,
    handleChange,
    handleSubmit,
  };
}
