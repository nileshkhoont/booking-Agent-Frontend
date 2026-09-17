import { apiClient } from "@/lib/api-client";
import type { BusinessConfig, BusinessConfigUpdatePayload } from "./types";

export const businessConfigApi = {
  get: () => apiClient.get<BusinessConfig>("/business-config"),
  update: (payload: BusinessConfigUpdatePayload) => apiClient.patch<BusinessConfig>("/business-config", payload),
};
