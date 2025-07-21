import { Button } from "../../tw-components/button";
import { Dialog, DialogActions } from "../../tw-components/dialog";
import {
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
}: BookingModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form id="booking-form" onSubmit={onSubmit}>
        <Fieldset>
          <Legend>{isEditing ? "Edit Appointment" : "Book Appointment"}</Legend>
          <Text>
            {isEditing
              ? `Update your appointment on ${appointmentFields.date} at ${appointmentFields.start} - ${appointmentFields.end}`
              : `Book your appointment on ${appointmentFields.date} at ${appointmentFields.start} - ${appointmentFields.end}`}
          </Text>
          <FieldGroup>
            <div className="sm:gap-4 grid grid-cols-1 sm:grid-cols-2">
              <Field>
                <Label>First name</Label>
                <Input
                  name="customer.firstName"
                  value={customerFields.firstName}
                  onChange={onChange}
                  required
                />
              </Field>
              <Field>
                <Label>Last name</Label>
                <Input
                  name="customer.lastName"
                  value={customerFields.lastName}
                  onChange={onChange}
                  required
                />
              </Field>
            </div>
            <Field>
              <Label>Email</Label>
              <Input
                name="customer.email"
                type="email"
                value={customerFields.email}
                onChange={onChange}
                required
              />
            </Field>
            <Field>
              <Label>Phone</Label>
              <Input
                name="customer.phone"
                type="tel"
                value={customerFields.phone}
                onChange={onChange}
                required
              />
            </Field>
            <FieldGroup>
              <Field>
                <Label>Service</Label>
                <Select
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
                <Label>Duration</Label>
                <Select
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
                <Label>Additional Notes</Label>
                <Textarea
                  name="appointment.notes"
                  rows={3}
                  placeholder="Any special requests or notes..."
                  value={appointmentFields.notes}
                  onChange={onChange}
                />
              </Field>
            </FieldGroup>
          </FieldGroup>
        </Fieldset>
      </form>
      <DialogActions>
        <Button color="red" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="booking-form">
          {isEditing ? "Update Appointment" : "Book Appointment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
