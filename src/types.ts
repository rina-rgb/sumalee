export type Booking = {
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