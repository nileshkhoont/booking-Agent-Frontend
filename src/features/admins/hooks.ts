import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminsApi, type AdminCreatePayload } from "./api";

export function useAdmins(params: { page?: number; page_size?: number }) {
  return useQuery({ queryKey: ["admins", params], queryFn: () => adminsApi.list(params) });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminCreatePayload) => adminsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admins"] }),
  });
}

export function useDeactivateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminsApi.update(id, { is_active: false }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admins"] }),
  });
}
