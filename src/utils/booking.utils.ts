import type { Booking } from '../types';
import { DEFAULT_BOOKING_VALUES, BOOKING_FORM_FIELDS } from '../constants/booking.constants';

/**
 * Creates a new booking with default values
 */
export function createNewBooking(
  therapistId: string,
  startTime: number,
  date: string
): Booking {
  return {
    id: crypto.randomUUID(),
    therapistId,
    startTime,
    date,
    ...DEFAULT_BOOKING_VALUES,
  };
}

/**
 * Extracts booking data from FormData
 */
export function extractBookingFromFormData(
  formData: FormData,
  existingBooking: Booking
): Booking {
  return {
    ...existingBooking,
    firstName: formData.get(BOOKING_FORM_FIELDS.FIRST_NAME) as string,
    lastName: formData.get(BOOKING_FORM_FIELDS.LAST_NAME) as string,
    email: formData.get(BOOKING_FORM_FIELDS.EMAIL) as string,
    phone: formData.get(BOOKING_FORM_FIELDS.PHONE) as string,
    service: formData.get(BOOKING_FORM_FIELDS.SERVICE) as string,
    durationMinutes: Number(formData.get(BOOKING_FORM_FIELDS.DURATION)),
    notes: formData.get(BOOKING_FORM_FIELDS.NOTES) as string,
  };
}

/**
 * Updates a booking in the bookings array
 */
export function updateBookingInList(
  bookings: Booking[],
  updatedBooking: Booking
): Booking[] {
  const existingIndex = bookings.findIndex((b) => b.id === updatedBooking.id);
  
  if (existingIndex === -1) {
    // New booking
    return [...bookings, updatedBooking];
  }
  
  // Update existing booking
  const newBookings = [...bookings];
  newBookings[existingIndex] = updatedBooking;
  return newBookings;
}

/**
 * Removes a booking from the bookings array
 */
export function removeBookingFromList(
  bookings: Booking[],
  bookingId: string
): Booking[] {
  return bookings.filter((b) => b.id !== bookingId);
}

/**
 * Finds a booking by ID
 */
export function findBookingById(
  bookings: Booking[],
  bookingId: string
): Booking | undefined {
  return bookings.find((b) => b.id === bookingId);
}

/**
 * Checks if a time slot is available for a therapist
 */
export function isTimeSlotAvailable(
  bookings: Booking[],
  therapistId: string,
  startTime: number,
  duration: number,
  date: string,
  excludeBookingId?: string
): boolean {
  const endTime = startTime + duration / 60;
  
  return !bookings.some((booking) => {
    if (booking.id === excludeBookingId) return false;
    if (booking.therapistId !== therapistId) return false;
    if (booking.date !== date) return false;
    
    const bookingEndTime = booking.startTime + booking.durationMinutes / 60;
    
    // Check for overlap
    return (
      (startTime >= booking.startTime && startTime < bookingEndTime) ||
      (endTime > booking.startTime && endTime <= bookingEndTime) ||
      (startTime <= booking.startTime && endTime >= bookingEndTime)
    );
  });
}
