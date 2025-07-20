export type Booking = {
  id: string;
  therapistId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  startTime: number; // e.g. 14 (2:00 PM)
  durationMinutes: number; // e.g. 60
  notes: string;
  date: string; // e.g. "2025-07-19"
};

export type Therapist = {
  id: string;
  name: string;
  avatarUrl?: string;
  color?: string; // optional for visual separation
};

export type TimeSlotProps = {
  time: number;
  onClick?: (time: number) => void;
  showTimeOnly?: boolean;
  showSlotOnly?: boolean;
};

export type ModalPayload =
  | { type: "new"; time: number; therapistId: string }
  | { type: "edit"; bookingId: string };


// In types.ts
export type TimeGridProps = {
  bookings: Booking[];
  currentDate: Date;
  openModal: (payload: ModalPayload) => void; // Add this
}


export type BookingModalProps = BookingModalData & {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isEditing: boolean;
}


export type BookingModalData = {
    isOpen: boolean;
    editingId?: string;
    bookingData: Partial<Booking>;
}