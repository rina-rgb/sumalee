import type { TimeSlotProps } from "../types";
import { formatHour } from "../utils/time";

export default function TimeSlot({
  time,
  onClick,
  showTimeOnly,
  showSlotOnly,
}: TimeSlotProps) {
  const isFullHour = Number.isInteger(time);

  return (
    <div
      className={`h-6 m-0 text-xs ${
        isFullHour ? "border-t border-gray-200" : ""
      }`}
    >
      {showTimeOnly && (
        <div
          className={`flex w-full ${
            isFullHour
              ? "font-semibold text-black"
              : "text-gray-300 justify-end items-start text-[0.60rem]"
          }`}
        >
          {formatHour(time)}
        </div>
      )}

      {showSlotOnly && (
        <div
          className="hover:bg-gray-50 w-full h-full cursor-pointer"
          onClick={() => onClick?.(time)}
        />
      )}
    </div>
  );
}
