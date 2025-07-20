import TimeSlot from "./TimeSlot";
import AppointmentBlock from "./AppointmentBlock";
import type { Booking, ModalPayload, Therapist } from "../types";

export default function TherapistColumn({
  therapist,
  bookings,
  slots,
  openModal,
}: {
  therapist: Therapist;
  bookings: Booking[];
  slots: number[];
  openModal: (payload: ModalPayload) => void;
}) {
  return (
    <div
      className="relative border-r"
      style={{ height: `${slots.length * 24}px` }}
    >
      {slots.map((slot) => (
        <TimeSlot
          key={slot}
          time={slot}
          showSlotOnly
          onClick={() =>
            openModal({ type: "new", time: slot, therapistId: therapist.id })
          }
        />
      ))}
      {bookings.map((booking) => (
        <AppointmentBlock
          key={`${booking.email}-${booking.startTime}-${booking.therapistId}`}
          booking={booking}
          onClick={() => openModal({ type: "edit", bookingId: booking.id })}
        />
      ))}
    </div>
  );
}
