import TherapistColumn from "./TherapistColumn";
import type { Therapist, TimeGridProps } from "../types";
import { useCalendarData } from "../hooks/useCalendarData";
import TimeColumn from "./TimeColumn";

const therapists: Therapist[] = [
  { id: "amy", name: "Amy" },
  { id: "bob", name: "Bob" },
  { id: "clara", name: "Clara" },
];

export default function TimeGrid({
  bookings,
  currentDate,
  openModal, // Use openModal instead of onNewBooking/onEditBooking
}: TimeGridProps) {
  const { slots, bookingsForDay } = useCalendarData(bookings, currentDate);

  return (
    <div className="grid grid-cols-[80px_repeat(3,_1fr)]">
      {/* Header Row */}
      <div className="font-bold">Time</div>
      {therapists.map((t) => (
        <div key={t.id} className="font-bold text-center">
          {t.name}
        </div>
      ))}

      {/* Time and Therapist columns */}
      <TimeColumn slots={slots} />
      {therapists.map((t) => (
        <TherapistColumn
          key={t.id}
          therapist={t}
          slots={slots}
          bookings={bookingsForDay.filter((b) => b.therapistId === t.id)}
          openModal={openModal} // Pass openModal through
        />
      ))}
    </div>
  );
}
