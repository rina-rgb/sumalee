import BookingModal from "../booking/BookingModal";
import TimeGrid from "./TimeGrid";
import { useBookings } from "../../hooks/useBookings";
import { useDateNavigation } from "../../hooks/useDateNavigation";

import { useBookingModal } from "../../hooks/useBookingModal";

import { useTestTherapists } from "../../hooks/useTestTherapists";
import { DateNavigation } from "./DateNavigation";
import LayoutAnimation from "../ui/ToggleSwitch";
import SlotsSuggestionsSidebar from "./SlotSuggestionsSidebar";
import { DndContext } from "@dnd-kit/core";
import { useDragToMove } from "../../hooks/useDragToMOve";

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
				<LayoutAnimation />
				<DateNavigation
					currentDate={currentDate}
					onPrev={goToPreviousDay}
					onToday={goToToday}
					onNext={goToNextDay}
				/>
				<div className="grid grid-cols-5 gap-4">
					<div className="col-span-4">
						<TimeGrid
							therapists={therapists}
							bookings={bookings}
							openModal={openModal}
						/>
					</div>
					<div className="col-span-1">
						<SlotsSuggestionsSidebar bookings={bookings} duration={60} />
					</div>
				</div>
			</section>
		</DndContext>
	);
}
