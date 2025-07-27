import { useState } from "react";

export function useDateNavigation(initialDate = new Date()) {
	// Safety check: ensure initialDate is a valid Date object
	const safeInitialDate =
		initialDate instanceof Date ? initialDate : new Date();
	const [currentDate, setCurrentDate] = useState(safeInitialDate);

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
