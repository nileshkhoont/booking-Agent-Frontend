import { apiClient } from "@/lib/api-client";
import type { Page } from "@/types/common";
import type { CallPurpose, CallScheduleStatus } from "@/types/enums";
import type { CallSchedule, CallScheduleCreatePayload } from "./types";

export const scheduleApi = {
  list: (params: {
    status?: CallScheduleStatus;
    call_purpose?: CallPurpose;
    q?: string;
    page?: number;
    page_size?: number;
  }) => apiClient.get<Page<CallSchedule>>("/call-schedules", params),
  get: (id: string) => apiClient.get<CallSchedule>(`/call-schedules/${id}`),
  create: (payload: CallScheduleCreatePayload) => apiClient.post<CallSchedule>("/call-schedules", payload),
  cancel: (id: string) => apiClient.post<CallSchedule>(`/call-schedules/${id}/cancel`),
};
