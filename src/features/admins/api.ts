import { apiClient } from "@/lib/api-client";
import type { Page } from "@/types/common";
import type { Admin } from "@/features/auth/types";
import type { AdminRole } from "@/types/enums";

export interface AdminCreatePayload {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

export const adminsApi = {
  list: (params: { page?: number; page_size?: number }) => apiClient.get<Page<Admin>>("/admins", params),
  create: (payload: AdminCreatePayload) => apiClient.post<Admin>("/admins", payload),
  update: (id: string, payload: Partial<Pick<Admin, "name" | "phone_number" | "role" | "is_active">>) =>
    apiClient.patch<Admin>(`/admins/${id}`, payload),
  remove: (id: string) => apiClient.delete<void>(`/admins/${id}`),
};
