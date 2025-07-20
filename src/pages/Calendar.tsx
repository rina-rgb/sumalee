import { useState } from "react";
import BookingModal from "../components/BookingModal";
import DateNavigator from "../components/Date";
import { useDateNavigation } from "../hooks/useDateNavigation";

export type Booking = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  startTime: number;
  endTime: number;
  notes: string;
};

const Calendar = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const { currentDate, goToNextDay, goToPreviousDay, goToToday } =
    useDateNavigation();

  const therapistName = "Amy";
  const startHour = 8;
  const endHour = 19;
  const date = Date.now();

  console.log(date);
  const timeArray = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  const handleTimeSlotClick = (time: number) => {
    setSelectedTimeSlot(time);
    setIsOpen(true);
  };

  const handleFormAction = (formData: FormData) => {
    if (!selectedTimeSlot) {
      console.error("No time slot selected");
      return;
    }

    // Create booking object
    const newBooking: Booking = {
      firstName: formData.get("first_name") as string,
      lastName: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      startTime: selectedTimeSlot,
      endTime: selectedTimeSlot + 1,
      notes: formData.get("notes") as string,
    };

    // Update bookings state
    setBookings((prev) => {
      const existingIndex = prev.findIndex(
        (b) => b.startTime === selectedTimeSlot
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newBooking;
        return updated;
      } else {
        return [...prev, newBooking];
      }
    });
    setIsOpen(false);
    setSelectedTimeSlot(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedTimeSlot(null);
  };

  return (
    <>
      <BookingModal
        isOpen={isOpen}
        onClose={handleCancel}
        selectedBooking={
          selectedTimeSlot
            ? bookings.find((b) => b.startTime === selectedTimeSlot) || {
                startTime: selectedTimeSlot,
              }
            : null
        }
        formAction={handleFormAction}
      />
      <div className="p-4">
        <div className="mx-auto my-auto p-4 border rounded-md w-10/12 h-full">
          <DateNavigator
            currentDate={currentDate}
            goToNextDay={goToNextDay}
            goToPreviousDay={goToPreviousDay}
            goToToday={goToToday}
          />

          {/* Header Row */}
          <div className="grid grid-cols-[minmax(80px,1fr)8fr] border-gray border-b font-bold">
            <div className="py-2 border-r">Time</div>
            <div className="px-2 py-2">{therapistName}</div>
          </div>
          {/* Time Rows */}
          {timeArray.map((time) => {
            const booking = bookings.find((b) => b.startTime === time);
            return (
              <div
                key={time}
                className="grid grid-cols-[minmax(80px,1fr)8fr] border-b"
              >
                <div className="m-0 p-0 border-r text-xs">{time}:00</div>
                <div
                  className="hover:bg-gray-50 p-2 text-sm cursor-pointer"
                  onClick={() => handleTimeSlotClick(time)}
                >
                  {booking ? (
                    <div className="flex flex-col h-24">
                      <div className="mb-1 font-medium text-gray-700 text-xs">
                        {booking.firstName} {booking.lastName}
                      </div>
                      <div className="mb-1 text-gray-600 text-xs">
                        {booking.service}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {booking.startTime} - {booking.endTime}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {booking.notes}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-24 text-gray-400">
                      Available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Calendar;
