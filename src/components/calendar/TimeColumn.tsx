import { formatHour } from "../../utils/time";

export default function TimeColumn({ slots }: { slots: number[] }) {
  return (
    <div className="border-r">
      {slots.map((time, rowIdx) => {
        const isFullHour = Number.isInteger(time);
        return (
          <div
            key={time}
            role="rowheader"
            aria-rowindex={rowIdx + 2}
            aria-colindex={1}
            className={`h-6 m-0 text-xs ${
              isFullHour ? "border-t border-gray-200" : ""
            }`}
          >
            <div
              className={`flex w-full ${
                isFullHour
                  ? "font-semibold text-black"
                  : "text-gray-300 justify-end items-start text-[0.60rem]"
              }`}
            >
              {formatHour(time)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
