"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { useAdmins, useCreateAdmin, useDeactivateAdmin } from "@/features/admins/hooks";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "At least 8 characters"),
  role: z.enum(["super_admin", "admin", "viewer"]),
});
type FormValues = z.infer<typeof schema>;

export default function AdminsSettingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, isError } = useAdmins({ page: 1, page_size: 50 });
  const createAdmin = useCreateAdmin();
  const deactivateAdmin = useDeactivateAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { role: "admin" } });

  function onSubmit(values: FormValues) {
    createAdmin.mutate(values, {
      onSuccess: () => {
        reset();
        setDialogOpen(false);
      },
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admins</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={16} /> Add admin
        </Button>
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorBanner message="Failed to load admins (only super_admin/admin roles can view this list)" />}

      {data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell className="capitalize">{admin.role.replace("_", " ")}</TableCell>
                <TableCell>
                  <Badge tone={admin.is_active ? "success" : "muted"}>
                    {admin.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {admin.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deactivateAdmin.mutate(admin.id)}
                      disabled={deactivateAdmin.isPending}
                    >
                      Deactivate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Add admin">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {createAdmin.isError && (
            <ErrorBanner
              message={createAdmin.error instanceof ApiError ? createAdmin.error.message : "Failed to create admin"}
            />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Temporary password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Role</Label>
            <Select id="role" {...register("role")}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAdmin.isPending}>
              {createAdmin.isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
