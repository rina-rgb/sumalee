// useBookingModal.ts
import { useState, useCallback } from "react";
import { calculateEndTime, formatHour } from "../utils/time";
import { toIsoDate } from "../utils/date";
import type { ModalPayload } from "../types";
import type { AppointmentFormFields, CustomerFormFields } from "../types/forms";
import type { Booking } from "../types";

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
  const [modalState, setModalState] = useState<BookingModalState>(initialModalState);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
          date: toIsoDate(currentDate),
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

      if (group === "customer") {
        setModalState((prev) => ({
          ...prev,
          customerFields: {
            ...prev.customerFields,
            [key]: value,
          },
        }));
      } else if (group === "appointment") {
        setModalState((prev) => {
          const updated = {
            ...prev.appointmentFields,
            [key]: key === "durationMinutes" ? Number(value) : value,
          };
          if (key === "start" || key === "durationMinutes") {
            updated.end = calculateEndTime(
              updated.start,
              Number(updated.durationMinutes)
            );
          }
          return { ...prev, appointmentFields: updated };
        });
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
      try {
        if (isEditing) {
          await updateBooking(bookingData);
        } else {
          await addBooking(bookingData);
        }
        setSubmitError(null);
        closeModal();
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Failed to save booking');
      }
    },
    [modalState, addBooking, updateBooking, closeModal]
  );

  return {
    modalState,
    openModal,
    closeModal,
    handleChange,
    handleSubmit,
    submitError,
  };
}
