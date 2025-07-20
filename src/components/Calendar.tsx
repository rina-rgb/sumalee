import BookingModal from "./BookingModal";
import DateNavigator from "./DateNavigator";
import TimeGrid from "./TimeGrid";
import { useBookings } from "../hooks/useBookings";
import { useDateNavigation } from "../hooks/useDateNavigation";

export default function Calendar() {
  const { currentDate, goToNextDay, goToPreviousDay, goToToday } =
    useDateNavigation();

  const {
    bookings,
    closeModal,
    handleFormAction,
    isOpen,
    openModal,
    bookingData,
  } = useBookings(currentDate);

  return (
    <>
      <BookingModal
        formAction={handleFormAction}
        isOpen={isOpen}
        onClose={closeModal}
        bookingData={bookingData} // ✅ make sure BookingModal accepts this prop
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
          bookings={bookings}
          currentDate={currentDate}
          openModal={openModal}
        />
      </section>
    </>
  );
}
