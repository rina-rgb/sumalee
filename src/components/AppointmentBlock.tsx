import { getEndTime, formatHour } from "../utils/time";
import type { Booking } from "../types";

type AppointmentBlockProps = {
  booking: Booking;
  onClick: (booking: Booking) => void;
};

export default function AppointmentBlock({
  booking,
  onClick,
}: AppointmentBlockProps) {
  const rowHeight = 24; // 15 min = 24px
  const startOffset = (((booking.startTime - 8) * 60) / 15) * rowHeight;
  const height = (booking.durationMinutes / 15) * rowHeight;

  return (
    <div
      className="right-0 left-0 z- absolute bg-gray-100 px-2 text-xs cursor-pointer"
      style={{ top: `${startOffset}px`, height: `${height}px` }}
      onClick={() => onClick(booking)}
    >
      <div className="font-medium">
        {booking.firstName} {booking.lastName}
      </div>
      <div>{booking.service}</div>
      <div className="text-gray-500">
        {formatHour(booking.startTime)} –{" "}
        {formatHour(getEndTime(booking.startTime, booking.durationMinutes))}
      </div>
    </div>
  );
}
