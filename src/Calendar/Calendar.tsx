import { useState } from "react";

type Booking = {
  hour: number;
  clientName: string;
};

const Calendar = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const startHour = 8;
  const endHour = 19;

  const timeArray = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  const therapistName = "Amy";

  const handleTimeSlotClick = (time) => {};

  return (
    <>
      <dialog>O HAI, I’m a dialog. Click on me to dismiss.</dialog>
      <div className="mx-auto p-4 border rounded-md w-full max-w-xl">
        {/* Header Row */}
        <div className="grid grid-cols-[minmax(80px,1fr)8fr] border-gray border-b font-bold">
          <div className="py-2 border-r">Time</div>
          <div className="px-2 py-2">{therapistName}</div>
        </div>

        {/* Time Rows */}
        {timeArray.map((time) => (
          <div
            key={time}
            className="grid grid-cols-[minmax(80px,1fr)8fr] border-b"
          >
            <div className="m-0 p-0 border-r text-xs">{time}:00</div>
            <div
              className="p-2 text-sm"
              onClick={() => handleTimeSlotClick(time)}
            >
              {bookings.find((b) => b.hour === time)?.clientName || "Available"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Calendar;
