import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "./api";
import type { CallPurpose, CallScheduleStatus } from "@/types/enums";
import type { CallScheduleCreatePayload } from "./types";

export function useCallSchedules(params: {
  status?: CallScheduleStatus;
  call_purpose?: CallPurpose;
  q?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({ queryKey: ["call-schedules", params], queryFn: () => scheduleApi.list(params) });
}

export function useCreateCallSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CallScheduleCreatePayload) => scheduleApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["call-schedules"] }),
  });
}

export function useCancelCallSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scheduleApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["call-schedules"] }),
  });
}
