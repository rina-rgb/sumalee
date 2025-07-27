import type { Therapist, Booking, ModalPayload } from "../../types";
import { TIME_GRID_ROW_HEIGHT } from "../../utils/constants";
import { formatHour, getAppointmentBlockStyle } from "../../utils/time";
import { useDroppable, useDraggable } from "@dnd-kit/core";

// Separate component for droppable time slot
function DroppableTimeSlot({ 
  time, 
  rowIdx, 
  colIdx, 
  therapist, 
  openModal 
}: {
  time: number;
  rowIdx: number;
  colIdx: number;
  therapist: Therapist;
  openModal: (payload: ModalPayload) => void;
}) {
  const dropId = `${therapist.id}|${formatHour(time)}`;
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
  });
  
  return (
    <button
      key={time}
      ref={setNodeRef}
      role="gridcell"
      aria-rowindex={rowIdx + 2}
      aria-colindex={colIdx + 2}
      aria-label={`Book ${formatHour(time)} for ${therapist.name}`}
      type="button"
      className={`block p-0 h-6 m-0 w-full bg-transparent hover:bg-gray-50 ${
        Number.isInteger(time) ? "border-t border-gray-200" : ""
      } ${isOver ? "bg-blue-100 cursor-copy" : "cursor-pointer"}`}
      onClick={() => openModal({ type: "new", time, therapistId: therapist.id })}
    />
  );
}

export default function TherapistColumn({
  therapist,
  colIdx,
  slots,
  bookings,
  openModal,
}: {
  therapist: Therapist;
  colIdx: number;
  slots: number[];
  bookings: Booking[];
  openModal: (payload: ModalPayload) => void;
}) {

    const renderAvailableSlots = (slots: number[]) => {
    return (
      slots.map((time, rowIdx) => (
        <DroppableTimeSlot
          key={time}
          time={time}
          rowIdx={rowIdx}
          colIdx={colIdx}
          therapist={therapist}
          openModal={openModal}
        />
      ))
    )
  }

// Separate component for draggable booking
function DraggableBooking({ 
  booking, 
  slots, 
  colIdx, 
  openModal 
}: {
  booking: Booking;
  slots: number[];
  colIdx: number;
  openModal: (payload: ModalPayload) => void;
}) {
  const customer = booking.customer;
  const style = getAppointmentBlockStyle(booking.start, booking.end);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: booking.id,
  });
  
  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : {};
  
  return (
    <button
      key={booking.id}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      role="gridcell"
      aria-rowindex={
        slots.findIndex(
          (t) => formatHour(t) === booking.start
        ) + 2
      }
      aria-colindex={colIdx + 2}
      aria-label={`Edit ${booking.service} for ${customer?.firstName} ${customer?.lastName} at ${booking.start}`}
      type="button"
      className={`right-1 left-1 absolute bg-gray-100 px-2 rounded text-xs ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{...style, ...dragStyle}}
      onClick={() => openModal({ type: "edit", booking })}
    >
      <div className="font-medium">
        {customer?.firstName} {customer?.lastName}
      </div>
      <div>{booking.service}</div>
      <div className="text-gray-500">
        {booking.start} – {booking.end}
      </div>
    </button>
  );
}

  const renderBookings = (slots: number[]) => {
       return (  bookings.map((booking) => (
        <DraggableBooking
          key={booking.id}
          booking={booking}
          slots={slots}
          colIdx={colIdx}
          openModal={openModal}
        />
      ))
    )
  }
  return (
    <div
      role="row"
      className="relative border-r"
      style={{ height: `${slots.length * TIME_GRID_ROW_HEIGHT}px` }}
    >
      {renderAvailableSlots(slots)}
      {renderBookings(slots)}
    </div>
  );
}