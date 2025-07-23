import BookingModal from "../booking/BookingModal";
import TimeGrid from "./TimeGrid";
import { useBookings } from "../../hooks/useBookings";
import { useDateNavigation } from "../../hooks/useDateNavigation";

import { useBookingModal } from "../../hooks/useBookingModal";

import { useTestTherapists } from "../../hooks/useTestTherapists";
import { DateNavigation } from "./DateNavigation";
import LayoutAnimation from "../ui/ToggleSwitch";

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
    isError: bError,
  } = useBookings(currentDate);

  const {
    modalState,
    openModal,
    closeModal,
    handleChange,
    handleSubmit,
    submitError,
  } = useBookingModal(currentDate, addBooking, updateBooking);

  const isLoading = tLoading || bLoading;
  const isError = tError || bError;

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error loading calendar.</p>;

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
      <LayoutAnimation />
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
