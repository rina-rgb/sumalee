import AppointmentBlock from "../components/AppointmentBlock";
import BookingModal from "../components/BookingModal";
import DateNavigator from "../components/DateNavigator";
import TimeSlot from "../components/TimeSlot";
import { useBookings } from "../hooks/useBookings";
import { useCalendarData } from "../hooks/useCalendarData";
import { useDateNavigation } from "../hooks/useDateNavigation";
import type { Therapist } from "../types";

const Calendar = () => {
  const { currentDate, goToNextDay, goToPreviousDay, goToToday } =
    useDateNavigation();
  const {
    bookings,
    isOpen,
    selectedTimeSlot,
    selectedBooking,
    openModal,
    closeModal,
    handleFormAction,
  } = useBookings(currentDate);

  const therapists: Therapist[] = [
    { id: "amy", name: "Amy" },
    { id: "bob", name: "Bob" },
    { id: "clara", name: "Clara" },
  ];
  const { slots, bookingsForDay } = useCalendarData(bookings, currentDate);
  return (
    <>
      <BookingModal
        isOpen={isOpen}
        onClose={closeModal}
        selectedBooking={
          selectedBooking ||
          (selectedTimeSlot
            ? {
                startTime: selectedTimeSlot.time,
                therapistId: selectedTimeSlot.therapistId,
              }
            : null)
        }
        formAction={handleFormAction}
      />
      <section className="p-4" aria-labelledby="calendar-heading">
        <div className="mx-auto my-auto p-4 border rounded-md w-10/12 h-full">
          <header className="mb-4">
            <h2 id="calendar-heading" className="font-semibold text-lg">
              Appointments
            </h2>
            <DateNavigator
              currentDate={currentDate}
              goToNextDay={goToNextDay}
              goToPreviousDay={goToPreviousDay}
              goToToday={goToToday}
            />
          </header>

          {/* Header Row */}
          <div className="grid grid-cols-[80px_repeat(3,_1fr)]">
            <div className="font-bold">Time</div>
            {therapists.map((t) => (
              <div key={t.id} className="font-bold text-center">
                {t.name}
              </div>
            ))}
          </div>

          {/* Time Grid Rendered */}
          <div className="grid grid-cols-[80px_repeat(3,_1fr)]">
            {/* Left Time Column */}
            <div className="border-r">
              {slots.map((slot) => (
                <TimeSlot key={`time-${slot}`} time={slot} showTimeOnly />
              ))}
            </div>

            {/* One column per therapist */}
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className="relative border-r"
                style={{ height: `${slots.length * 24}px` }}
              >
                {slots.map((slot) => (
                  <TimeSlot
                    key={`slot-${therapist.id}-${slot}`}
                    time={slot}
                    showSlotOnly
                    onClick={() =>
                      openModal({ time: slot, therapistId: therapist.id })
                    }
                  />
                ))}
                {bookingsForDay
                  .filter((b) => b.therapistId === therapist.id)
                  .map((b) => (
                    <AppointmentBlock
                      key={`${b.email}-${b.startTime}-${b.therapistId}`}
                      booking={b}
                      onClick={() => openModal(b)}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Calendar;
