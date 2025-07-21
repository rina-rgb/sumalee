import BookingModal from "../booking/BookingModal";
import TimeGrid from "./TimeGrid";
import { useBookings } from "../../hooks/useBookings";
import { useDateNavigation } from "../../hooks/useDateNavigation";

import { useBookingModal } from "../../hooks/useBookingModal";
import { useTestTherapists } from "../../hooks/useTestTherapists";
import { Button } from "../../tw-components/button";

export default function Calendar() {
  const { currentDate, goToNextDay, goToPreviousDay, goToToday } =
    useDateNavigation();
  const {
    therapists,
    isLoading: tLoading,
    isError: tError,
  } = useTestTherapists();
  const {
    bookings,
    addBooking,
    updateBooking,
    isLoading: bLoading,
  } = useBookings(currentDate);

  const { modalState, openModal, closeModal, handleChange, handleSubmit } =
    useBookingModal(currentDate, addBooking, updateBooking);

  if (tLoading || bLoading) return <p>Loading…</p>;
  if (tError) return <p>Error loading therapists.</p>;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
    });
  };

  const toIsoDate = (date: Date): string => {
    return date.toISOString().split("T")[0]; // "2025-07-19"
  };

  return (
    <>
      <BookingModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isEditing={modalState.isEditing}
        customerFields={modalState.customerFields}
        appointmentFields={modalState.appointmentFields}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <section className="p-4">
        <h2 className="mb-4 font-bold text-xl">Appointments</h2>
        <div className="flex justify-between gap-4 text-lg">
          <div>
            <time dateTime={toIsoDate(currentDate)} className="font-medium">
              {formatDate(currentDate)}
            </time>
          </div>
          <div>
            <button
              onClick={goToPreviousDay}
              className="hover:bg-gray-200 px-2 py-1 rounded cursor-pointer"
            >
              ←
            </button>
            <Button onClick={goToToday} className="cursor-pointer">Today</Button>
            <button
              onClick={goToNextDay}
              className="hover:bg-gray-200 px-2 py-1 rounded cursor-pointer"
            >
              →
            </button>
          </div>
        </div>
        <TimeGrid
          therapists={therapists}
          bookings={bookings}
          openModal={openModal}
          currentDate={currentDate}
        />
      </section>
    </>
  );
}
