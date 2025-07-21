
import TimeColumn from "./TimeColumn";
import type { TimeGridProps } from "../../types";
import { useCalendarGrid } from "../../hooks/useCalendarGrid";
import { getAppointmentBlockStyle } from "../../utils/time";

export default function TimeGrid({
  therapists,
  bookings, // now Booking[]
  openModal,
}: TimeGridProps) {
  const { slots, groupBookingsByTherapist } = useCalendarGrid();
  const byTherapist = groupBookingsByTherapist(bookings);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `80px repeat(${therapists.length}, 1fr)`,
      }}
    >
      {/* Header row */}
      <div className="font-bold">Time</div>
      {therapists.map((t) => (
        <div key={t.id} className="font-bold text-center">
          {t.name}
        </div>
      ))}

      <TimeColumn slots={slots} />

      {/* One column per therapist */}
      {therapists.map((therapist) => {
        const therapistBookings = byTherapist[therapist.id] ?? [];
        return (
          <div
            key={therapist.id}
            className="relative border-r"
            style={{ height: `${slots.length * 24}px` }}
          >
            {slots.map((time) => {
              const isFullHour = Number.isInteger(time);
              return (
                <div
                  key={time}
                  className={`h-6 m-0 cursor-pointer hover:bg-gray-50 ${
                    isFullHour ? "border-t border-gray-200" : ""
                  }`}
                  onClick={() =>
                    openModal({
                      type: "new",
                      time: time,
                      therapistId: therapist.id,
                    })
                  }
                />
              );
            })}

            {therapistBookings.map((booking) => {
              const customer = booking.customer;
              const style = getAppointmentBlockStyle(booking.start, booking.end);
              return (
                <div
                  key={booking.id}
                  className="right-1 left-1 absolute bg-gray-100 px-2 rounded text-xs cursor-pointer"
                  style={style}
                  onClick={() =>
                    openModal({
                      type: "edit",
                      booking,
                    })
                  }
                >
                  <div className="font-medium">
                    {customer?.firstName} {customer?.lastName}
                  </div>
                  <div>{booking.service}</div>
                  <div className="text-gray-500">
                    {booking.start} – {booking.end}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
