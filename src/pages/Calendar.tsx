import BookingModal from "../components/BookingModal";
import DateNavigator from "../components/Date";
import TimeSlot from "../components/TimeSlot";
import { useBookings } from "../hooks/useBookings";
import { useCalendarData } from "../hooks/useCalendarData";
import { useDateNavigation } from "../hooks/useDateNavigation";

const Calendar = () => {
  const { currentDate, goToNextDay, goToPreviousDay, goToToday } =
    useDateNavigation();

  const {
    bookings,
    isOpen,
    selectedTimeSlot,
    openModal,
    closeModal,
    handleFormAction,
  } = useBookings(currentDate);

  const { slots, getBookingsAtSlot } = useCalendarData(bookings, currentDate);

  const currentDateStr = currentDate.toISOString().split("T")[0];

  const timeSlotsUI = slots.map((hour) => (
    <TimeSlot
      key={hour}
      time={hour}
      bookings={getBookingsAtSlot(hour)}
      onClick={openModal}
    />
  ));

  return (
    <>
      <BookingModal
        isOpen={isOpen}
        onClose={closeModal}
        selectedBooking={
          selectedTimeSlot
            ? bookings.find(
                (b) =>
                  b.startTime === selectedTimeSlot && b.date === currentDateStr
              ) || { startTime: selectedTimeSlot }
            : null
        }
        formAction={handleFormAction}
      />

      <section className="p-4" aria-labelledby="calendar-heading">
        <div className="mx-auto my-auto p-4 border rounded-md w-10/12 h-full">
          <header className="mb-4">
            <h2 id="calendar-heading" className="font-semibold text-lg">
              Amy's Calendar
            </h2>
            <DateNavigator
              currentDate={currentDate}
              goToNextDay={goToNextDay}
              goToPreviousDay={goToPreviousDay}
              goToToday={goToToday}
            />
          </header>

          {/* Header Row */}
          <div className="grid grid-cols-[minmax(80px,1fr)_8fr] border-b font-bold text-sm">
            <div className="py-2 border-r">Time</div>
            <div className="px-2 py-2">Appointments</div>
          </div>

          {/* Time Grid Rendered */}
          {timeSlotsUI}
        </div>
      </section>
    </>
  );
};

export default Calendar;
