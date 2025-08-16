import type { Booking, Therapist } from "./domain";

export type ModalPayload =
	| {
			type: "new";
			time: number;
			therapistId: string;
	  }
	| {
			type: "edit";
			booking: Booking;
	  };
export type TimeGridProps = {
	therapists: Therapist[];
	bookings: Booking[];
	openModal: (payload: ModalPayload) => void;
	date: Date;
};
