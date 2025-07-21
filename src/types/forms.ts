/**
 * Represents the shape of customer data used in forms.
 * Based on the `Customer` domain model.
 */
export type CustomerFormFields = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

/**
 * Represents the shape of appointment data used in forms.
 * Based on the `Booking` domain model.
 * Note: `notes` is a `string` here for the controlled component,
 * whereas it's `string | undefined` in the domain model.
 */
export type AppointmentFormFields = {
  service: string;
  durationMinutes: number;
  notes: string;
  date: string;
  start: string;
  end: string;
  therapistId: string;
}; 