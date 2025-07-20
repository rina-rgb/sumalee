import BookingModal from "./BookingModal";
import DateNavigator from "./DateNavigator";
import TimeGrid from "./TimeGrid";
import { useBookings } from "../hooks/useBookings";
import { useBookingModal } from "../hooks/useBookingModal";
import { useDateNavigation } from "../hooks/useDateNavigation";
import type { ModalPayload } from "../types";

export default function Calendar() {
  const { currentDate, goToNextDay, goToPreviousDay, goToToday } =
    useDateNavigation();
  const { bookings, saveBooking, getBooking } = useBookings(); // Fixed: use saveBooking
  const {
    modalState,
    openNewBooking,
    openEditBooking,
    closeModal,
    createBookingFromForm,
    isEditing,
  } = useBookingModal();

  const handleSaveBooking = (formData: FormData) => {
    const booking = createBookingFromForm(formData);
    saveBooking(booking); // Fixed: use saveBooking for both new and edit
    closeModal();
  };

  // Create openModal function that matches the expected signature
  const openModal = (payload: ModalPayload) => {
    if (payload.type === "edit") {
      const booking = getBooking(payload.bookingId);
      if (booking) openEditBooking(booking);
    } else {
      openNewBooking(
        payload.time,
        payload.therapistId,
        currentDate.toISOString().split("T")[0]
      );
    }
  };

  // Filter bookings for current date
  const todaysBookings = bookings.filter(
    (b) => b.date === currentDate.toISOString().split("T")[0]
  );

  return (
    <>
      <BookingModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleSaveBooking}
        bookingData={modalState.bookingData}
        isEditing={isEditing}
      />

      <section className="p-4">
        <h2 className="mb-4 font-bold text-xl">Appointments</h2>

        <DateNavigator
          currentDate={currentDate}
          goToNextDay={goToNextDay}
          goToPreviousDay={goToPreviousDay}
          goToToday={goToToday}
        />

        <TimeGrid
          bookings={todaysBookings}
          currentDate={currentDate}
          openModal={openModal} // Pass the openModal function
        />
      </section>
    </>
  );
}
