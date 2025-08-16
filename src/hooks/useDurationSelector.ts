import { useState, useCallback } from "react";

export const DURATION_OPTIONS = [
	{ value: 60, label: "60 minutes" },
	{ value: 90, label: "90 minutes" },
	{ value: 120, label: "120 minutes" },
] as const;

export type Duration = typeof DURATION_OPTIONS[number]["value"];

export function useDurationSelector(initialDuration: Duration = 60) {
	const [selectedDuration, setSelectedDuration] = useState<Duration>(initialDuration);

	const handleDurationChange = useCallback((duration: Duration) => {
		setSelectedDuration(duration);
	}, []);

	return {
		selectedDuration,
		handleDurationChange,
		durationOptions: DURATION_OPTIONS,
	};
}