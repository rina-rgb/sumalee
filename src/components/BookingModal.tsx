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
import type { BookingModalProps } from "../types";
import { formatHour } from "../utils/time";

export default function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  bookingData,
  isEditing,
}: BookingModalProps) {
  if (!bookingData) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form id="booking-form" action={onSubmit}>
        <Fieldset>
          <Legend>{isEditing ? "Edit Appointment" : "Book Appointment"}</Legend>
          <Text>
            Please fill out the form below to {isEditing ? "update" : "book"}{" "}
            your appointment for {formatHour(bookingData.startTime)}
          </Text>
          <FieldGroup>
            <div className="sm:gap-4 grid grid-cols-1 sm:grid-cols-2">
              <Field>
                <Label>First name</Label>
                <Input
                  name="firstName"
                  defaultValue={bookingData.firstName || ""}
                  required
                />
              </Field>
              <Field>
                <Label>Last name</Label>
                <Input
                  name="lastName"
                  defaultValue={bookingData.lastName || ""}
                  required
                />
              </Field>
            </div>
            <Field>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                defaultValue={bookingData.email || ""}
                required
              />
            </Field>
            <Field>
              <Label>Phone</Label>
              <Input
                name="phone"
                type="tel"
                defaultValue={bookingData.phone || ""}
                required
              />
            </Field>
            <FieldGroup>
              <Field>
                <Label>Service</Label>
                <Select
                  name="service"
                  defaultValue={bookingData.service || ""}
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
                  name="durationMinutes"
                  defaultValue={(bookingData.durationMinutes || 60).toString()}
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
                  name="notes"
                  rows={3}
                  placeholder="Any special requests or notes..."
                  defaultValue={bookingData.notes || ""}
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
