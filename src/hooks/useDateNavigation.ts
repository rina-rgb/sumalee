import { useState } from "react";

export function useDateNavigation(initialDate = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const goToNextDay = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
  };

  const goToPreviousDay = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
  };

  const goToToday = () => setCurrentDate(new Date());

  return { currentDate, goToNextDay, goToPreviousDay, goToToday };
}