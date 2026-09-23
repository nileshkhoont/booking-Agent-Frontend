import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "./api";
import type { AppointmentStatus } from "@/types/enums";
import type { AppointmentCreatePayload } from "./types";

export function useAppointments(params: {
  status?: AppointmentStatus;
  q?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({ queryKey: ["appointments", params], queryFn: () => appointmentsApi.list(params) });
}

export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => appointmentsApi.get(id as string),
    enabled: Boolean(id),
  });
}

export function useAppointmentsForPerson(personId: string | undefined) {
  return useQuery({
    queryKey: ["appointments", "for-person", personId],
    queryFn: () => appointmentsApi.forPerson(personId as string),
    enabled: Boolean(personId),
  });
}

export function useBookableAppointments(personId?: string) {
  return useQuery({
    queryKey: ["appointments", "bookable", personId],
    queryFn: () => appointmentsApi.bookable(personId),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AppointmentCreatePayload) => appointmentsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newDatetime, notes }: { id: string; newDatetime: string; notes?: string }) =>
      appointmentsApi.reschedule(id, newDatetime, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => appointmentsApi.cancel(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
}
