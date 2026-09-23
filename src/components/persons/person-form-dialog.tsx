"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorBanner } from "@/components/common/error-banner";
import { useCreatePerson } from "@/features/persons/hooks";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
  full_name: z.string().optional(),
  phone_number: z.string().min(6, "Enter a valid phone number (E.164, e.g. +919876543210)"),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PersonFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createPerson = useCreatePerson();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    createPerson.mutate(
      { ...values, full_name: values.full_name || undefined, email: values.email || undefined },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add person" closeOnBackdropClick={false}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {createPerson.isError && (
          <ErrorBanner
            message={createPerson.error instanceof ApiError ? createPerson.error.message : "Failed to create person"}
          />
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name">Full name (optional)</Label>
          <Input id="full_name" {...register("full_name")} />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone_number">Phone number</Label>
          <Input id="phone_number" placeholder="+919876543210" {...register("phone_number")} />
          {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Input id="notes" {...register("notes")} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createPerson.isPending}>
            {createPerson.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
