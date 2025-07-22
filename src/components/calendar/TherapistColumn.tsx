import type { Therapist, Booking, ModalPayload } from "../../types";
import { TIME_GRID_ROW_HEIGHT } from "../../utils/constants";
import { formatHour, getAppointmentBlockStyle } from "../../utils/time";


export default function TherapistColumn({
  therapist,
  colIdx,
  slots,
  bookings,
  openModal,
}: {
  therapist: Therapist;
  colIdx: number;
  slots: number[];
  bookings: Booking[];
  openModal: (payload: ModalPayload) => void;
}) {


    const renderAvailableSlots = (slots: number[]) => {
    return (
      slots.map((time, rowIdx) => (
        <button
          key={time}
          role="gridcell"
          aria-rowindex={rowIdx + 2}
          aria-colindex={colIdx + 2}
          aria-label={`Book ${formatHour(time)} for ${therapist.name}`}
          type="button"
          className={`block p-0 h-6 m-0 w-full bg-transparent hover:bg-gray-50 cursor-pointer ${
            Number.isInteger(time) ? "border-t border-gray-200" : ""
          }`}
          onClick={() => openModal({ type: "new", time, therapistId: therapist.id })}
        />
      ))
    )
  }

  const renderBookings = (slots: number[]) => {
       return (  bookings.map((booking) => {
        const customer = booking.customer;
        const style = getAppointmentBlockStyle(booking.start, booking.end);
        return (
          <button
            key={booking.id}
            role="gridcell"
            aria-rowindex={
              slots.findIndex(
                (t) => formatHour(t) === booking.start
              ) + 2
            }
            aria-colindex={colIdx + 2}
            aria-label={`Edit ${booking.service} for ${customer?.firstName} ${customer?.lastName} at ${booking.start}`}
            type="button"
            className="right-1 left-1 absolute bg-gray-100 px-2 cursor-pointer rounded text-xs"
            style={style}
            onClick={() => openModal({ type: "edit", booking })}
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
      })
    )
  }
  return (
    <div
      role="row"
      className="relative border-r"
      style={{ height: `${slots.length * TIME_GRID_ROW_HEIGHT}px` }}
    >
      {renderAvailableSlots(slots)}
      {renderBookings(slots)}
    </div>
  );
}