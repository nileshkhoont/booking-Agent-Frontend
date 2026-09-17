import { apiClient } from "@/lib/api-client";
import type { Page } from "@/types/common";
import type { AppointmentStatus } from "@/types/enums";
import type { Appointment, AppointmentCreatePayload, SlotCheckResponse } from "./types";

export const appointmentsApi = {
  list: (params: { status?: AppointmentStatus; page?: number; page_size?: number }) =>
    apiClient.get<Page<Appointment>>("/appointments", params),
  get: (id: string) => apiClient.get<Appointment>(`/appointments/${id}`),
  forPerson: (personId: string) => apiClient.get<Appointment[]>(`/appointments/for-person/${personId}`),
  bookable: (personId?: string) => apiClient.get<Appointment[]>("/appointments/bookable", { person_id: personId }),
  checkSlot: (requested_datetime: string, exclude_appointment_id?: string) =>
    apiClient.post<SlotCheckResponse>("/appointments/check-slot", { requested_datetime, exclude_appointment_id }),
  create: (payload: AppointmentCreatePayload) => apiClient.post<Appointment>("/appointments", payload),
  reschedule: (id: string, new_appointment_datetime: string, notes?: string) =>
    apiClient.post<Appointment>(`/appointments/${id}/reschedule`, { new_appointment_datetime, notes }),
  cancel: (id: string, reason?: string) => apiClient.post<Appointment>(`/appointments/${id}/cancel`, { reason }),
};
