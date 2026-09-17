import { useMutation, useQuery } from "@tanstack/react-query";
import { setTokens } from "@/lib/auth";
import { getAccessToken } from "@/lib/auth";
import { authApi } from "./api";
import type { LoginPayload } from "./types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => setTokens(data.access_token, data.refresh_token),
  });
}

export function useCurrentAdmin() {
  return useQuery({
    queryKey: ["admins", "me"],
    queryFn: authApi.me,
    enabled: Boolean(getAccessToken()),
    retry: false,
  });
}
