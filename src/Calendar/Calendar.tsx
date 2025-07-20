import { useState } from "react";
import BookingModal from "../BookingModal/BookingModal";

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

  const therapistName = "Amy";
  const startHour = 8;
  const endHour = 19;

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
      // Check if there's an existing booking for this time slot
      const existingIndex = prev.findIndex((b) => b.startTime === selectedTimeSlot);
      
      if (existingIndex !== -1) {
        // Update existing booking
        const updated = [...prev];
        updated[existingIndex] = newBooking;
        return updated;
      } else {
        // Add new booking
        return [...prev, newBooking];
      }
    });

    // Close modal and reset
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
        selectedBooking={selectedTimeSlot ? bookings.find(b => b.startTime === selectedTimeSlot) || { startTime: selectedTimeSlot } : null}
        formAction={handleFormAction}
      />
      <div className="mx-auto p-4 border rounded-md w-full max-w-xl">
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
                className="p-2 text-sm cursor-pointer hover:bg-gray-50"
                onClick={() => handleTimeSlotClick(time)}
              >
                {booking ? (
                  <div className="h-24 flex flex-col justify-center">
                    <div className="text-xs text-gray-700 font-medium mb-1">{booking.firstName} {booking.lastName}</div>
                    <div className="text-xs text-gray-600 mb-1">{booking.service}</div>
                    <div className="text-xs text-gray-500">{booking.startTime} - {booking.endTime}</div>
                    <div className="text-xs text-gray-400">{booking.notes}</div>
                  </div>
                ) : (
                  <div className="text-gray-400 h-24 flex items-center justify-center">Available</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Calendar;
