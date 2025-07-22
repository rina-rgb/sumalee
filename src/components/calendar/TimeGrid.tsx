// import { useMemo } from "react";
import TimeColumn from "./TimeColumn";
import type { TimeGridProps } from "../../types";
import TherapistColumn from "./TherapistColumn";
import { generateIntervalSlots, groupByTherapist } from "../../utils/grid";
import { TIME_GRID_BASE_HOUR, TIME_GRID_END_HOUR, TIME_GRID_INTERVAL_MINUTES } from "../../utils/constants";

export default function TimeGrid({
  therapists,
  bookings, // now Booking[]
  openModal,
}: TimeGridProps) {
  const intervalSlots = generateIntervalSlots(TIME_GRID_BASE_HOUR, TIME_GRID_END_HOUR, TIME_GRID_INTERVAL_MINUTES);
  const bookingsByTherapist = groupByTherapist(bookings);
  const GridHeader = ({ therapists }: { therapists: TimeGridProps["therapists"] }) => {
  return (
    <>
      <div role="columnheader" aria-colindex={1} className="font-bold">
        Time
      </div>
      {therapists.map((t, colIdx) => (
        <div
          key={t.id}
          role="columnheader"
          aria-colindex={colIdx + 2}
          className="font-bold text-center"
        >
          {t.name}
        </div>
      ))}
    </>
  );
};

  return (
    <div
      role="grid"
      aria-label="Daily schedule"
      aria-rowcount={intervalSlots.length + 1}
      aria-colcount={therapists.length + 1}
      className="grid"
      style={{
        gridTemplateColumns: `80px repeat(${therapists.length}, 1fr)`,
      }}
    >
      <GridHeader therapists={therapists} />

      <TimeColumn slots={intervalSlots} />
      {therapists.map((therapist, colIdx) => (
        <TherapistColumn
          key={therapist.id}
          therapist={therapist}
          colIdx={colIdx}
          slots={intervalSlots}
          bookings={bookingsByTherapist[therapist.id] ?? []}
          openModal={openModal}
        />
      ))}
    </div>
  );
}
