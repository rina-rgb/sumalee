import { Button } from "../tw-components/button";
import { Dialog, DialogActions } from "../tw-components/dialog";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "../tw-components/fieldset";
import { Input } from "../tw-components/input";
import { Select } from "../tw-components/select";
import { Text } from "../tw-components/text";
import { Textarea } from "../tw-components/textarea";
import type { Booking } from "../types";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: Booking | { startTime: number } | null;
  formAction: (formData: FormData) => void;
};

export default function BookingModal({
  isOpen,
  onClose,
  selectedBooking,
  formAction,
}: BookingModalProps) {
  // Check if this is an existing booking (has firstName) or a new booking (only has startTime)
  const isExistingBooking = selectedBooking && "firstName" in selectedBooking;
  const { firstName, lastName, email, phone, service, startTime, notes } =
    selectedBooking && "firstName" in selectedBooking ? selectedBooking : {};

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form id="booking-form" action={formAction}>
        <Fieldset>
          <Legend>
            {isExistingBooking ? "Edit Appointment" : "Book Appointment"}
          </Legend>
          <Text>
            Please fill out the form below to{" "}
            {isExistingBooking ? "update" : "book"} your appointment for{" "}
            {startTime}:00.
          </Text>
          <FieldGroup>
            <div className="sm:gap-4 grid grid-cols-1 sm:grid-cols-2">
              <Field>
                <Label>First name</Label>
                <Input
                  name="first_name"
                  defaultValue={firstName || ""}
                  required
                />
              </Field>
              <Field>
                <Label>Last name</Label>
                <Input
                  name="last_name"
                  defaultValue={lastName || ""}
                  required
                />
              </Field>
            </div>
            <Field>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                defaultValue={email || ""}
                required
              />
            </Field>
            <Field>
              <Label>Phone</Label>
              <Input
                name="phone"
                type="tel"
                defaultValue={phone || ""}
                required
              />
            </Field>
            <FieldGroup>
              <Field>
                <Label>Service</Label>
                <Select name="service" defaultValue={service || ""} required>
                  <option value="">Select a service</option>
                  <option value="Massage Therapy">Massage Therapy</option>
                  <option value="Acupuncture">Acupuncture</option>
                  <option value="Chiropractic Care">Chiropractic Care</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                </Select>
              </Field>
              <Field>
                <Label>Duration</Label>
                <Select name="duration" defaultValue="" required>
                  <option value="">Select duration</option>
                  <option value="30">30 mins</option>
                  <option value="45">45 mins</option>
                  <option value="60">1 hour</option>
                  <option value="90">90 minutes</option>
                </Select>
              </Field>
              <Field>
                <Label>Additional Notes</Label>
                <Textarea
                  name="notes"
                  rows={3}
                  placeholder="Any special requests or notes..."
                  defaultValue={notes || ""}
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
          {isExistingBooking ? "Update Appointment" : "Book Appointment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
