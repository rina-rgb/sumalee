import React from "react";
import useFindBestScheduleSlots from "../../hooks/useFindBestScheduleSlots";
import { useTestTherapists } from "../../hooks/useTestTherapists";
import { findBestScheduleSlots } from "../../lib/slotfinder";
import type { Booking, Therapist } from "../../types/domain";

interface SwapSidebarProps {
	bookings: Booking[];
	duration: number;
}

export default function SlotsSuggestionsSidebar({
	bookings,
	duration, // in minutes
}: SwapSidebarProps) {
	const proposals = useFindBestScheduleSlots(bookings, duration);
	const { therapists } = useTestTherapists();

	console.log(proposals);

	// Helper: Format time to ensure HH:mm format
	const formatTime = (time: string) => {
		const [hours, minutes] = time.split(":");
		return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
	};

	// Helper: Calculate end time from start time and duration
	const calculateEndTime = (startTime: string, durationMinutes: number) => {
		const startMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
		const endMinutes = startMinutes + durationMinutes;
		const endHours = Math.floor(endMinutes / 60);
		const endMins = endMinutes % 60;
		return formatTime(`${endHours}:${String(endMins).padStart(2, "0")}`);
	};

	// Helper: Render a list of time slots
	const renderSlotList = (slots: string[], color: string, label: string) => {
		if (slots.length === 0) return null;
		
		return (
			<div>
				<h4 className={`text-sm font-medium ${color} mb-1`}>{label}:</h4>
				<ul className="space-y-1">
					{slots.map((slot, slotIdx) => {
						const startTime = formatTime(slot);
						const endTime = calculateEndTime(slot, duration);
						return (
							<li key={slotIdx} className="text-sm">
								<span className={`font-medium ${color.replace('text-', 'text-').replace('-700', '-600')}`}>
									{startTime} - {endTime}
								</span>
								<span className="text-xs text-gray-500 ml-2">({label.toLowerCase()})</span>
							</li>
						);
					})}
				</ul>
			</div>
		);
	};

	// Helper: Render therapist with no bookings (fully available)
	const renderAvailableTherapist = (therapist: Therapist, idx: number) => {
		const emptyScheduleSlots = findBestScheduleSlots(duration, []);
		console.log(`Empty schedule slots for ${therapist.name}:`, emptyScheduleSlots);

		return (
			<div key={idx} className="border-l-2 border-green-500 pl-3">
				<h3 className="font-semibold text-lg mb-2">{therapist.name}</h3>
				<div className="space-y-2">
					{renderSlotList(emptyScheduleSlots.strict, "text-green-700", "Available")}
				</div>
			</div>
		);
	};

	// Helper: Render therapist with existing bookings
	const renderBusyTherapist = (therapist: Therapist, therapistData: any, idx: number) => {
		const { bestSlots } = therapistData;
		const hasAnySlots = bestSlots.strict.length > 0 || bestSlots.soft.length > 0;

		if (!hasAnySlots) return null;

		return (
			<div key={idx} className="border-l-2 border-blue-500 pl-3">
				<h3 className="font-semibold text-lg mb-2">{therapist.name}</h3>
				<div className="space-y-2">
					{renderSlotList(bestSlots.strict, "text-green-700", "Optimal")}
					{renderSlotList(bestSlots.soft, "text-yellow-700", "Acceptable")}
				</div>
			</div>
		);
	};

	// Main render - much cleaner now!
	return (
		<aside aria-label="Swap Options Sidebar">
			<h2 className="text-sm mb-8">Available Slots by Therapist</h2>
			{therapists.length === 0 ? (
				<p className="text-sm align-middle text-gray-500">Loading therapists...</p>
			) : (
				<div className="space-y-4">
					{therapists.map((therapist, idx) => {
						// Find if this therapist has existing bookings
						const therapistData = proposals.find(
							(p) => p.therapist.therapistId === therapist.id
						);

						// Render based on whether they have bookings or not
						if (!therapistData) {
							// No bookings = fully available
							return renderAvailableTherapist(therapist, idx);
						} else {
							// Has bookings = show available slots between appointments
							return renderBusyTherapist(therapist, therapistData, idx);
						}
					})}
				</div>
			)}
		</aside>
	);
}
