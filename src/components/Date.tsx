"use client";

import { Button } from "../tw-components/button";

type DateNavigatorProps = {
  currentDate: Date;
  goToNextDay: () => void;
  goToPreviousDay: () => void;
  goToToday: () => void;
};

export default function DateNavigator({
  currentDate,
  goToNextDay,
  goToPreviousDay,
  goToToday,
}: DateNavigatorProps) {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
    });
  };

  const toIsoDate = (date: Date): string => {
    return date.toISOString().split("T")[0]; // "2025-07-19"
  };

  return (
    <div className="flex justify-between gap-4 text-lg">
      <div>
        <time dateTime={toIsoDate(currentDate)} className="font-medium">
          {formatDate(currentDate)}
        </time>
      </div>
      <div>
        <button
          onClick={goToPreviousDay}
          className="hover:bg-gray-200 px-2 py-1 rounded"
        >
          ←
        </button>
        <Button onClick={goToToday}>Today</Button>
        <button
          onClick={goToNextDay}
          className="hover:bg-gray-200 px-2 py-1 rounded"
        >
          →
        </button>
      </div>
    </div>
  );
}
