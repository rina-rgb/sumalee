import { Button } from "../../tw-components/button";
import { Dialog, DialogTitle, DialogDescription, DialogActions } from "../../tw-components/dialog";
import {
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "../../tw-components/fieldset";
import { Input } from "../../tw-components/input";
import { Select } from "../../tw-components/select";
import { Text } from "../../tw-components/text";
import { Textarea } from "../../tw-components/textarea";
import type {
  AppointmentFormFields,
  CustomerFormFields,
} from "../../types/forms";

// Add onChange to the props type
export type BookingModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  customerFields: CustomerFormFields;
  appointmentFields: AppointmentFormFields;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  onChange,
  customerFields,
  appointmentFields,
  errorMessage,
}: BookingModalProps & { errorMessage?: string }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {isEditing ? "Edit Appointment" : "Book Appointment"}
      </DialogTitle>
      <DialogDescription>
        <Text>
          {isEditing
            ? `Update your appointment on ${appointmentFields.date} at ${appointmentFields.start} - ${appointmentFields.end}`
            : `Book your appointment on ${appointmentFields.date} at ${appointmentFields.start} - ${appointmentFields.end}`}
        </Text>
      </DialogDescription>
      <form id="booking-form" onSubmit={onSubmit}>
        {errorMessage && (<ErrorMessage>{errorMessage}</ErrorMessage>)}
        <Fieldset>
          <Legend>Customer Information</Legend>
          <FieldGroup>
            <div className="sm:gap-4 pt-0 grid grid-cols-1 sm:grid-cols-2">
              <Field>
                <Label htmlFor="customer.firstName">First name</Label>
                <Input
                  id="customer.firstName"
                  name="customer.firstName"
                  value={customerFields.firstName}
                  onChange={onChange}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="customer.lastName">Last name</Label>
                <Input
                  id="customer.lastName"
                  name="customer.lastName"
                  value={customerFields.lastName}
                  onChange={onChange}
                  required
                />
              </Field>
            </div>
            <Field>
              <Label htmlFor="customer.email">Email</Label>
              <Input
                id="customer.email"
                name="customer.email"
                type="email"
                value={customerFields.email}
                onChange={onChange}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="customer.phone">Phone</Label>
              <Input
                id="customer.phone"
                name="customer.phone"
                type="tel"
                value={customerFields.phone}
                onChange={onChange}
                required
              />
            </Field>
          </FieldGroup>
        </Fieldset>
        <Fieldset>
          <Legend>Appointment Details</Legend>
          <FieldGroup>
            <Field>
              <Label htmlFor="appointment.service">Service</Label>
              <Select
                id="appointment.service"
                name="appointment.service"
                value={appointmentFields.service}
                onChange={onChange}
                required
              >
                <option value="">Select a service</option>
                <option value="Massage Therapy">Massage Therapy</option>
                <option value="Acupuncture">Acupuncture</option>
                <option value="Chiropractic Care">Chiropractic Care</option>
                <option value="Physical Therapy">Physical Therapy</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="appointment.durationMinutes">Duration</Label>
              <Select
                id="appointment.durationMinutes"
                name="appointment.durationMinutes"
                value={appointmentFields.durationMinutes.toString()}
                onChange={onChange}
                required
              >
                <option value="30">30 mins</option>
                <option value="45">45 mins</option>
                <option value="60">1 hour</option>
                <option value="90">90 minutes</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="appointment.notes">Additional Notes</Label>
              <Textarea
                id="appointment.notes"
                name="appointment.notes"
                rows={3}
                placeholder="Any special requests or notes..."
                value={appointmentFields.notes}
                onChange={onChange}
              />
            </Field>
          </FieldGroup>
        </Fieldset>
      </form>
      <DialogActions>
        <Button type="button" color="red" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="booking-form">
          {isEditing ? "Update Appointment" : "Book Appointment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
