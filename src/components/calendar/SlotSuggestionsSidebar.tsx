import React from "react";
import useFindBestScheduleSlots from "../../hooks/useFindBestScheduleSlots";
import { useTestTherapists } from "../../hooks/useTestTherapists";
import { findBestScheduleSlots } from "../../lib/slotfinder";
import type { Booking, Therapist } from "../../types/domain";
import type { ModalPayload } from "../../types/calendar";
import { generateIntervalSlots } from "../../utils/grid";
import {
	TIME_GRID_BASE_HOUR,
	TIME_GRID_END_HOUR,
	TIME_GRID_INTERVAL_MINUTES,
	TIME_GRID_ROW_HEIGHT,
} from "../../utils/constants";
import { useDurationSelector } from "../../hooks/useDurationSelector";
import DurationSelector from "../ui/DurationSelector";

// Import premium Tailwind UI components
import { Badge } from "../../tw-components/badge";
import { Heading, Subheading } from "../../tw-components/heading";
import { Text, Strong, Code } from "../../tw-components/text";
import { Avatar } from "../../tw-components/avatar";

interface SwapSidebarProps {
	bookings: Booking[];
	openModal: (payload: ModalPayload) => void;
}

export default function SlotsSuggestionsSidebar({
	bookings,
	openModal,
}: SwapSidebarProps) {
	// Use internal duration state
	const { selectedDuration, handleDurationChange } = useDurationSelector(60);
	const proposals = useFindBestScheduleSlots(bookings, selectedDuration);
	const { therapists } = useTestTherapists();

	// Calculate the exact height to match the schedule
	const intervalSlots = generateIntervalSlots(
		TIME_GRID_BASE_HOUR,
		TIME_GRID_END_HOUR,
		TIME_GRID_INTERVAL_MINUTES
	);
	const headerHeight = 72; // Approximate header height (py-6 = 24px top + 24px bottom + content)
	const scheduleHeight =
		intervalSlots.length * TIME_GRID_ROW_HEIGHT + headerHeight;

	console.log(proposals);

	// Helper: Format time to ensure HH:mm format
	const formatTime = (time: string) => {
		const [hours, minutes] = time.split(":");
		return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
	};

	// Helper: Calculate end time from start time and duration
	const calculateEndTime = (startTime: string, durationMinutes: number) => {
		const startMinutes =
			parseInt(startTime.split(":")[0]) * 60 +
			parseInt(startTime.split(":")[1]);
		const endMinutes = startMinutes + durationMinutes;
		const endHours = Math.floor(endMinutes / 60);
		const endMins = endMinutes % 60;
		return formatTime(`${endHours}:${String(endMins).padStart(2, "0")}`);
	};

	// Helper: Render a list of time slots using premium components
	const renderSlotList = (
		slots: string[],
		variant: "optimal" | "acceptable" | "available",
		label: string,
		therapistId: string
	) => {
		if (slots.length === 0) return null;

		// Define badge colors for different slot types
		const badgeColors = {
			optimal: "emerald" as const,
			acceptable: "amber" as const,
			available: "blue" as const,
		};

		const icons = {
			optimal: "✓",
			acceptable: "~",
			available: "●",
		};

		return (
			<div className="space-y-3">
				{/* Section Header */}
				<div className="flex items-center gap-2">
					<span className="text-sm">{icons[variant]}</span>
					<Subheading
						level={4}
						className="!text-xs !text-gray-500 !font-normal"
					>
						{label} Slots
					</Subheading>
					<Badge color={badgeColors[variant]}>{slots.length}</Badge>
				</div>

				{/* Time Slots */}
				<div className="grid gap-2">
					{slots.map((slot, slotIdx) => {
						const startTime = formatTime(slot);
						const endTime = calculateEndTime(slot, selectedDuration);
						
						// Convert time string to number for modal (matching TimeGrid format)
						// "16:30" -> 16.5, "16:00" -> 16.0
						const [hours, minutes] = slot.split(':').map(Number);
						const timeNumber = hours + (minutes / 60);
						
						return (
							<button
								key={slotIdx}
								className="group relative rounded-lg border border-zinc-950/10 bg-white px-3 py-2.5 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800 w-full text-left"
								onClick={() => openModal({ 
									type: "new", 
									time: timeNumber, 
									therapistId: therapistId 
								})}
							>
								<div className="flex items-center justify-between">
									<Code className="!bg-transparent !border-0 !px-0 font-mono text-sm font-semibold">
										{startTime} – {endTime}
									</Code>
									<Text className="!text-xs">{selectedDuration}min</Text>
								</div>
							</button>
						);
					})}
				</div>
			</div>
		);
	};

	// Helper: Render therapist with no bookings (fully available)
	const renderAvailableTherapist = (therapist: Therapist, idx: number) => {
		const emptyScheduleSlots = findBestScheduleSlots(selectedDuration, []);
		console.log(
			`Empty schedule slots for ${therapist.name}:`,
			emptyScheduleSlots
		);

		// Get therapist initials for avatar
		const getInitials = (name: string) => {
			return name
				.split(" ")
				.map((n) => n.charAt(0))
				.join("")
				.slice(0, 2)
				.toUpperCase();
		};

		return (
			<div
				key={idx}
				className="rounded-xl border border-zinc-950/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-zinc-900"
			>
				{/* Therapist Header */}
				<div className="flex items-center gap-3 mb-5">
					<Avatar
						src={therapist.avatarUrl}
						initials={getInitials(therapist.name)}
						alt={therapist.name}
						className="size-10"
					/>
					<div className="flex-1">
						<Subheading level={3} className="!text-base">
							{therapist.name}
						</Subheading>
						<Text className="!text-xs">Fully Available Today</Text>
					</div>
					<Badge color="emerald">Open</Badge>
				</div>

				{/* Available Slots */}
				<div className="space-y-4">
					{renderSlotList(
						emptyScheduleSlots.strict,
						"available",
						"Recommended",
						therapist.id
					)}
				</div>
			</div>
		);
	};

	// Helper: Render therapist with existing bookings
	const renderBusyTherapist = (
		therapist: Therapist,
		therapistData: any,
		idx: number
	) => {
		const { bestSlots } = therapistData;
		const hasAnySlots =
			bestSlots.strict.length > 0 || bestSlots.soft.length > 0;
		const totalSlots = bestSlots.strict.length + bestSlots.soft.length;

		if (!hasAnySlots) return null;

		// Get therapist initials for avatar
		const getInitials = (name: string) => {
			return name
				.split(" ")
				.map((n) => n.charAt(0))
				.join("")
				.slice(0, 2)
				.toUpperCase();
		};

		return (
			<div
				key={idx}
				className="rounded-xl border border-zinc-950/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-zinc-900"
			>
				{/* Therapist Header */}
				<div className="flex items-center gap-3 mb-5">
					<Avatar
						src={therapist.avatarUrl}
						initials={getInitials(therapist.name)}
						alt={therapist.name}
						className="size-10"
					/>
					<div className="flex-1">
						<Text className="font-semibold !text-black">{therapist.name}</Text>
						{/* <Text className="!text-xs">{totalSlots} slots available</Text> */}
					</div>
				</div>
				{/* Available Slots */}
				<div className="space-y-6">
					{renderSlotList(bestSlots.strict, "optimal", "Optimal", therapist.id)}
					{renderSlotList(bestSlots.soft, "acceptable", "Acceptable", therapist.id)}
				</div>
			</div>
		);
	};

	// Main render - premium design with Tailwind UI components!
	return (
		<aside
			className="overflow-y-auto border-l border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900"
			style={{ height: `${scheduleHeight}px` }}
			aria-label="Available Slots Sidebar"
		>
			{/* Premium Header */}
			{/* <div className="font-mono sticky top-0 z-10 border-b border-zinc-950/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-zinc-900">
				<div className="flex items-center gap-3">
					<div className="size-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
					<Heading level={5}>Available Slots</Heading>
				</div>
				<Text className="mt-1">Find the perfect appointment time</Text>
			</div> */}

			{/* Content */}
			<div className="p-6">
				{/* Duration Selector at the top */}
				<div className="mb-6">
					<DurationSelector
						value={selectedDuration}
						onChange={handleDurationChange}
						label="Duration:"
					/>
				</div>
				{therapists.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
							<svg
								className="size-6 text-zinc-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<Strong>Loading therapists...</Strong>
						<Text className="mt-1">
							Please wait while we fetch available slots
						</Text>
					</div>
				) : (
					<div className="space-y-6">
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
			</div>
		</aside>
	);
}
