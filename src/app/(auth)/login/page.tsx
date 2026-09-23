"use client";

import { Suspense } from "react";
import { PhoneCall } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBanner } from "@/components/common/error-banner";
import { useLogin } from "@/features/auth/hooks";
import { ApiError } from "@/lib/api-client";
import { siteConfig } from "@/config/site";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginForm) {
    login.mutate(values, {
      onSuccess: () => {
        const next = searchParams.get("next") ?? "/";
        router.push(next);
      },
    });
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="items-center pb-2 pt-6 text-center">
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-sm">
          <PhoneCall size={18} />
        </div>
        <CardTitle className="text-base text-foreground">{siteConfig.name}</CardTitle>
        <p className="text-xs text-muted-foreground">Admin sign in</p>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {login.isError && (
            <ErrorBanner
              message={login.error instanceof ApiError ? login.error.message : "Login failed"}
            />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={login.isPending} className="mt-2">
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
