import { create } from "zustand";
import type { CallOutcome, CallStatus, CallType } from "@/types/enums";

interface CallFiltersState {
  dateFrom?: string;
  dateTo?: string;
  callType?: CallType;
  callStatus?: CallStatus;
  outcome?: CallOutcome;
  setFilters: (filters: Partial<Omit<CallFiltersState, "setFilters" | "reset">>) => void;
  reset: () => void;
}

export const useCallFiltersStore = create<CallFiltersState>((set) => ({
  dateFrom: undefined,
  dateTo: undefined,
  callType: undefined,
  callStatus: undefined,
  outcome: undefined,
  setFilters: (filters) => set(filters),
  reset: () =>
    set({ dateFrom: undefined, dateTo: undefined, callType: undefined, callStatus: undefined, outcome: undefined }),
}));
