import type { Booking } from '../types';

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

/**
 * Validates booking data
 */
export function validateBooking(booking: Partial<Booking>): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!booking.firstName?.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!booking.lastName?.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!booking.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(booking.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!booking.phone?.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!isValidPhone(booking.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number format' });
  }

  if (!booking.service) {
    errors.push({ field: 'service', message: 'Service is required' });
  }

  if (!booking.durationMinutes || booking.durationMinutes <= 0) {
    errors.push({ field: 'duration', message: 'Duration must be greater than 0' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (basic validation)
 */
function isValidPhone(phone: string): boolean {
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Check if it contains only digits and is between 10-15 digits
  return /^\d{10,15}$/.test(cleaned);
}

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map((error) => error.message).join('\n');
}
