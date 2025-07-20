// Form field names
export const BOOKING_FORM_FIELDS = {
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  EMAIL: 'email',
  PHONE: 'phone',
  SERVICE: 'service',
  DURATION: 'duration',
  NOTES: 'notes',
} as const;

// Default values for new bookings
export const DEFAULT_BOOKING_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: '',
  durationMinutes: 60, // Default to 1 hour
  notes: '',
} as const;

// Service options (example)
export const SERVICE_OPTIONS = [
  { value: 'massage', label: 'Massage Therapy', duration: 60 },
  { value: 'acupuncture', label: 'Acupuncture', duration: 45 },
  { value: 'consultation', label: 'Consultation', duration: 30 },
  { value: 'physiotherapy', label: 'Physiotherapy', duration: 60 },
] as const;
