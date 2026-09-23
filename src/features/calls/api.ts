import { apiClient } from "@/lib/api-client";
import type { Page } from "@/types/common";
import type { CallOutcome, CallStatus, CallType } from "@/types/enums";
import type { Call } from "./types";

export interface CallFilters {
  date_from?: string;
  date_to?: string;
  call_type?: CallType;
  call_status?: CallStatus;
  outcome?: CallOutcome;
  person_id?: string;
  q?: string;
  page?: number;
  page_size?: number;
}

export const callsApi = {
  list: (params: CallFilters) => apiClient.get<Page<Call>>("/calls", params as Record<string, string>),
  get: (id: string) => apiClient.get<Call>(`/calls/${id}`),
};
