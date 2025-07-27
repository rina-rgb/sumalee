import { formatHour } from "../../utils/time";

export default function TimeColumn({ slots }: { slots: number[] }) {
  return (
    <div className="border-r border-gray-100">
      {slots.map((t, i) => (
        <div
          key={t}
          role="rowheader"
          aria-rowindex={i + 2}
          aria-colindex={1}
          className={`h-6 text-xs flex w-full ${
            Number.isInteger(t)
              ? "border-t border-gray-100 font-semibold text-black"
              : "text-gray-400 justify-end items-start text-[0.60rem]"
          }`}
        >
          {formatHour(t)}
        </div>
      ))}
    </div>
  );
}