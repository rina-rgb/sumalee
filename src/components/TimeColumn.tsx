import TimeSlot from "./TimeSlot";

export default function TimeColumn({ slots }: { slots: number[] }) {
  return (
    <div className="border-r">
      {slots.map((slot) => (
        <TimeSlot key={slot} time={slot} showTimeOnly />
      ))}
    </div>
  );
}
