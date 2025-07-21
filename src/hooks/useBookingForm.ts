import { useState, useCallback } from "react";
import type { AppointmentFormFields, CustomerFormFields } from "../types/forms";
import { calculateEndTime } from "../utils/time";

export const initialCustomerFields: CustomerFormFields = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export const initialAppointmentFields: AppointmentFormFields = {
  service: "",
  durationMinutes: 60,
  notes: "",
  start: "",
  end: "",
  date: "",
  therapistId: "",
};

export function useBookingForm() {
  const [customerFields, setCustomerFields] = useState<CustomerFormFields>(
    initialCustomerFields
  );
  const [appointmentFields, setAppointmentFields] =
    useState<AppointmentFormFields>(initialAppointmentFields);

  const setFields = useCallback(
    (
      appt: Partial<AppointmentFormFields>,
      cust: Partial<CustomerFormFields> = {}
    ) => {
      if (Object.keys(appt).length) {
        setAppointmentFields((prev) => ({ ...prev, ...appt }));
      }
      if (Object.keys(cust).length) {
        setCustomerFields((prev) => ({ ...prev, ...cust }));
      }
    },
    []
  );

  const resetFields = useCallback(() => {
    setCustomerFields(initialCustomerFields);
    setAppointmentFields(initialAppointmentFields);
  }, []);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      const [group, key] = name.split(".");

      if (group === "customer") {
        setCustomerFields((prev) => ({ ...prev, [key]: value }));
      } else {
        setAppointmentFields((prev) => {
          const updated = { ...prev, [key]: value };
          // Recalculate end time if start or duration changes
          if (key === "start" || key === "durationMinutes") {
            const { start, durationMinutes } = { ...prev, ...updated };
            updated.end = calculateEndTime(start, Number(durationMinutes));
          }
          return updated;
        });
      }
    },
    []
  );

  const formState = {
    customerFields,
    appointmentFields,
  };

  return { formState, setFields, resetFields, handleChange };
} 