import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessConfigApi } from "./api";
import type { BusinessConfigUpdatePayload } from "./types";

export function useBusinessConfig() {
  return useQuery({ queryKey: ["business-config"], queryFn: businessConfigApi.get, retry: false });
}

export function useUpdateBusinessConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BusinessConfigUpdatePayload) => businessConfigApi.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-config"] }),
  });
}
