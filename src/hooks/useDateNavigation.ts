import { useState } from "react";

export function useDateNavigation(initialDate = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const goToNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const goToPreviousDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    goToNextDay,
    goToPreviousDay,
    goToToday,
  };
}
