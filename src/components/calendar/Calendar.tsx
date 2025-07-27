import BookingModal from "../booking/BookingModal";
import TimeGrid from "./TimeGrid";
import { useBookings } from "../../hooks/useBookings";
import { useDateNavigation } from "../../hooks/useDateNavigation";

import { useBookingModal } from "../../hooks/useBookingModal";

import { useTestTherapists } from "../../hooks/useTestTherapists";
import { DateNavigation } from "./DateNavigation";
import ToggleSwitch from "../ui/ToggleSwitch";
import SlotsSuggestionsSidebar from "./SlotSuggestionsSidebar";
import { DndContext } from "@dnd-kit/core";
import { useDragToMove } from "../../hooks/useDragToMOve";
import { useSidebarToggle } from "../../hooks/useSidebarToggle";
import * as motion from "motion/react-client";

export default function Calendar() {
	const { currentDate, goToNextDay, goToPreviousDay, goToToday } =
		useDateNavigation();

	const {
		therapists,
		isLoading: tLoading,
		isError: tError,
	} = useTestTherapists();

	const {
		bookings,
		addBooking,
		updateBooking,
		isLoading: bLoading,
		isError: bError,
	} = useBookings(currentDate);

	const {
		modalState,
		openModal,
		closeModal,
		handleChange,
		handleSubmit,
		submitError,
	} = useBookingModal(currentDate, addBooking, updateBooking);

	const moveBooking = useDragToMove(currentDate);
	
	// Sidebar toggle state
	const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebarToggle(false);

	const handleDragEnd = ({ active, over }) => {
		if (!over) return;
		// over.id === `${therapistId}|${time}`
		const [newTherapistId, newStart] = over.id.split("|");
		moveBooking(active.id, newTherapistId, newStart);
	};

	const isLoading = tLoading || bLoading;
	const isError = tError || bError;

	if (isLoading) return <p>Loading…</p>;
	if (isError) return <p>Error loading calendar.</p>;

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<section className="p-4" aria-label="Calendar">
				<BookingModal
					isOpen={modalState.isOpen}
					onClose={closeModal}
					isEditing={modalState.isEditing}
					customerFields={modalState.customerFields}
					appointmentFields={modalState.appointmentFields}
					onChange={handleChange}
					onSubmit={handleSubmit}
					errorMessage={submitError ?? undefined}
				/>
				<div className="flex justify-between items-center mb-4">
					<h2 className="font-semibold text-xl">Appointments</h2>
					<ToggleSwitch 
						isOn={sidebarOpen} 
						onToggle={toggleSidebar}
						label="Show Suggestions"
					/>
				</div>
				<div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
					<DateNavigation
						currentDate={currentDate}
						onPrev={goToPreviousDay}
						onToday={goToToday}
						onNext={goToNextDay}
					/>
					<motion.div 
						className="bg-white px-6"
						layout
						transition={{
							duration: 0.3,
							ease: "easeInOut"
						}}
					>
						<div className="flex gap-4">
							<motion.div 
								className="flex-1"
								layout
								transition={{
									duration: 0.3,
									ease: "easeInOut"
								}}
							>
								<TimeGrid
									therapists={therapists}
									bookings={bookings}
									openModal={openModal}
									date={currentDate}
								/>
							</motion.div>
							<motion.div
								initial={false}
								animate={{
									width: sidebarOpen ? "auto" : 0,
									opacity: sidebarOpen ? 1 : 0,
								}}
								transition={{
									duration: 0.4,
									ease: [0.4, 0, 0.2, 1],
									opacity: { duration: sidebarOpen ? 0.4 : 0.2 }
								}}
								style={{
									overflow: "hidden",
									display: sidebarOpen ? "block" : "none"
								}}
								className="min-w-80"
							>
								<motion.div
									initial={false}
									animate={{
										x: sidebarOpen ? 0 : 100,
										opacity: sidebarOpen ? 1 : 0
									}}
									transition={{
										duration: 0.4,
										ease: [0.4, 0, 0.2, 1],
										delay: sidebarOpen ? 0.1 : 0
									}}
								>
									<SlotsSuggestionsSidebar bookings={bookings} />
								</motion.div>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</section>
		</DndContext>
	);
}
