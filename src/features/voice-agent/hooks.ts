import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { voiceAgentApi } from "./api";
import type { AgentConfigUpdatePayload } from "./types";

export function useVoiceAgentConfig() {
  return useQuery({ queryKey: ["voice-agent"], queryFn: voiceAgentApi.get, retry: false });
}

export function useUpdateVoiceAgentConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AgentConfigUpdatePayload) => voiceAgentApi.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["voice-agent"] }),
  });
}
