
import React, { useMemo } from "react";
import TimeColumn from "./TimeColumn";
import type { TimeGridProps } from "../../types";
import { TIME_GRID_ROW_HEIGHT } from "../../utils/constants";
import { useCalendarGrid } from "../../hooks/useCalendarGrid";
import { getAppointmentBlockStyle } from "../../utils/time";
import { formatHour } from "../../utils/time";

export default function TimeGrid({
  therapists,
  bookings, // now Booking[]
  openModal,
}: TimeGridProps) {
  const { slots, groupBookingsByTherapist } = useCalendarGrid();
  const byTherapist = useMemo(
    () => groupBookingsByTherapist(bookings),
    [bookings, groupBookingsByTherapist]
  );

  return (
    <div
      role="grid"
      aria-label="Daily schedule"
      aria-rowcount={slots.length + 1}
      aria-colcount={therapists.length + 1}
      className="grid"
      style={{
        gridTemplateColumns: `80px repeat(${therapists.length}, 1fr)`,
      }}
    >
      {/* Header row */}
      <div role="columnheader" aria-colindex={1} className="font-bold">Time</div>
      {therapists.map((t, colIdx) => (
        <div key={t.id} role="columnheader" aria-colindex={colIdx + 2} className="font-bold text-center">
          {t.name}
        </div>
      ))}

      <TimeColumn slots={slots} />

      {/* One column per therapist */}
      {therapists.map((therapist, colIdx) => {
        const therapistBookings = byTherapist[therapist.id] ?? [];
        return (
          <div
            key={therapist.id}
            role="row"
            className="relative border-r"
            style={{ height: `${slots.length * TIME_GRID_ROW_HEIGHT}px` }}
          >
            {slots.map((time, rowIdx) => {
              const isFullHour = Number.isInteger(time);
              return (
                <button
                  key={time}
                  role="gridcell"
                  aria-rowindex={rowIdx + 2}
                  aria-colindex={colIdx + 2}
                  aria-label={`Book ${formatHour(time)} for ${therapist.name}`}
                  type="button"
                  className={`block p-0 h-6 m-0 w-full bg-transparent cursor-pointer hover:bg-gray-50 ${
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
                <button
                  key={booking.id}
                  type="button"
                  role="gridcell"
                  aria-label={`Edit ${booking.service} for ${customer?.firstName} ${customer?.lastName} at ${booking.start}`}
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
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
