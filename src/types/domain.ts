/** A person who can be booked */
export interface Therapist {
	id: string; // UUID or string key
	name: string; // display name
	avatarUrl?: string; // thumbnail image
	color?: string; // UI accent color
	specialties?: string[]; // e.g. ["massage","pt"]
	timeZone: string; // e.g. "America/Los_Angeles"
	availability: Availability; // precomputed slots per day
	createdAt: string; // ISO timestamp
	updatedAt: string; // ISO timestamp
}

/** A client or customer */
export interface Customer {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	avatarUrl?: string;
	createdAt: string; // ISO timestamp
}

/**
 * DTO for rendering a single day’s schedule,
 * with customer/therapist data already joined for easy UI use
 */
export interface Booking {
	id: string;
	therapistId: string;
	customer?: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
	};
	date: string; // "YYYY-MM-DD"
	start: string; // "HH:mm"
	end: string; // "HH:mm"
	service: string;
	durationMinutes: number;
	notes?: string;
	createdAt: string;
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** A simple time block (in hours, where .5 = “:30”) */
export type TimeInterval = {
	startHour: number;
	endHour: number;
};
export interface BookingInterval {
	therapistId: string;
	start: string; // "HH:mm"
	end: string; // "HH:mm"
	durationMinutes: number;
}
export type SlotClassification = {
	strict: string[]; // ideal slots: abut one side of a free interval
	soft: string[]; // fills one side only, aligned but leaves one unbookable gap
	bad: string[]; // wastes two gaps or leaves bookable gap
	badReasons: Record<string, string>; // human-readable reason per bad slot
};
/** Availability map per weekday */
export type Availability = Record<Weekday, TimeInterval[]>;
