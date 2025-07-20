import type { Booking } from "../types";
import { formatHour, getEndTime } from "../utils/time";

type TimeSlotProps = {
  time: number;
  bookings: Booking[];
  onClick: (time: number) => void;
};

export default function TimeSlot({ time, bookings, onClick }: TimeSlotProps) {
  return (
    <section
      className="grid grid-cols-[minmax(80px,1fr)_8fr] border-b"
      aria-labelledby={`slot-${time}`}
    >
      <header className="p-2 border-r text-gray-700 text-xs">
        <h3 id={`slot-${time}`} className="sr-only">
          {formatHour(time)}
        </h3>
        <time>{formatHour(time)}</time>
      </header>

      <div
        className="hover:bg-gray-50 p-2 text-sm cursor-pointer"
        onClick={() => onClick(time)}
      >
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <article
              key={b.email + b.startTime}
              className="flex flex-col mb-2 h-24"
            >
              <header>
                <h4 className="font-medium text-xs">
                  {b.firstName} {b.lastName}
                </h4>
              </header>
              <p className="text-gray-600 text-xs">{b.service}</p>
              <p className="text-gray-500 text-xs">
                {formatHour(b.startTime)} –{" "}
                {formatHour(getEndTime(b.startTime, b.durationMinutes))}
              </p>
              <p className="text-gray-400 text-xs">{b.notes}</p>
            </article>
          ))
        ) : (
          <div className="flex justify-center items-center h-24 text-gray-400">
            Available
          </div>
        )}
      </div>
    </section>
  );
}
