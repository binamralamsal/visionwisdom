import z from "zod";
import { GalleryVerticalEndIcon } from "lucide-react";

import {
  Link,
  createFileRoute,
  isRedirect,
  redirect,
} from "@tanstack/react-router";

import { api } from "@/orpc/client";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";

export const Route = createFileRoute("/_main/signup")({
  component: RouteComponent,
  validateSearch: z.object({
    redirect_url: z.string().startsWith("/").optional().catch(undefined),
  }),
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(
        api.users.current.session.queryOptions(),
      );
      throw redirect({ to: "/" });
    } catch (error) {
      if (isRedirect(error)) throw error;
    }
  },
});

function RouteComponent() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Vision Wisdom
        </Link>
        <RegisterForm />
      </div>
    </div>
  );
}
