import { useQuery } from "@tanstack/react-query";
import { callsApi, type CallFilters } from "./api";

export function useCalls(filters: CallFilters) {
  return useQuery({ queryKey: ["calls", filters], queryFn: () => callsApi.list(filters) });
}

export function useCall(id: string | undefined) {
  return useQuery({
    queryKey: ["calls", id],
    queryFn: () => callsApi.get(id as string),
    enabled: Boolean(id),
  });
}
