import BookingModal from "../booking/BookingModal";
import TimeGrid from "./TimeGrid";
import { useBookings } from "../../hooks/useBookings";
import { useDateNavigation } from "../../hooks/useDateNavigation";

import { useBookingModal } from "../../hooks/useBookingModal";

import { useTestTherapists } from "../../hooks/useTestTherapists";
import { DateNavigation } from "./DateNavigation";

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
    isValidating: bValidating,
    isError: bError,
    revalidate: revalidateBookings,
  } = useBookings(currentDate);

  const {
    modalState,
    openModal,
    closeModal,
    handleChange,
    handleSubmit,
    submitError,
  } = useBookingModal(currentDate, addBooking, updateBooking);

  if (tLoading || bLoading) return <p>Loading…</p>;
  if (tError) return <p>Error loading therapists.</p>;
  if (bError)
    return (
      <p>
        Error loading bookings.
        <button
          type="button"
          onClick={() => revalidateBookings()}
          disabled={bValidating}
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          aria-label="Retry loading bookings"
        >
          {bValidating ? 'Retrying...' : 'Retry'}
        </button>
      </p>
    );

  return (
    <section className="p-4" aria-label="Calendar">
      <BookingModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isEditing={modalState.isEditing}
        customerFields={modalState.customerFields}
        appointmentFields={modalState.appointmentFields}
        onChange={handleChange}
        onSubmit={handleSubmit}
        errorMessage={submitError ?? undefined}
      />
      <DateNavigation
        currentDate={currentDate}
        onPrev={goToPreviousDay}
        onToday={goToToday}
        onNext={goToNextDay}
      />
      <TimeGrid
        therapists={therapists}
        bookings={bookings}
        openModal={openModal}
      />
    </section>
  );
}
