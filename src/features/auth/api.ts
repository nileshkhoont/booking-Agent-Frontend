import { apiFetch } from "@/lib/api-client";
import type { Admin, LoginPayload, TokenResponse } from "./types";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiFetch<TokenResponse>("/auth/login", { method: "POST", body: payload, skipAuth: true }),
  me: () => apiFetch<Admin>("/admins/me"),
};
