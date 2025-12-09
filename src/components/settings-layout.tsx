import { toast } from "sonner";
import {
  BriefcaseIcon,
  LogOut,
  Settings,
  Smartphone,
  User,
} from "lucide-react";

import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SettingsNavItem, SettingsSidebar } from "./settings-sidebar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { api } from "@/orpc/client";

const settingsNavItems: SettingsNavItem[] = [
  {
    title: "General",
    href: "/settings",
    icon: User,
    description: "Profile & preferences",
  },
  {
    title: "Devices",
    href: "/settings/devices",
    icon: Smartphone,
    description: "Manage active sessions",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function SettingsLayout({
  children,
  title,
  description,
}: SettingsLayoutProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation(
    api.users.logout.mutationOptions({
      onSuccess: () => {
        toast.success("Logged out successfully");
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(
          api.users.current.user.queryOptions(),
        );
        navigate({ to: "/login" });
      },
    }),
  );

  return (
    <div className="min-h-screen">
      <section className="border-b py-10 md:py-14">
        <div className="container">
          <header className="mx-auto flex max-w-4xl flex-col gap-4 text-center md:text-left">
            <div className="bg-primary/10 inline-flex items-center justify-center gap-2 self-center rounded-full px-3 py-1 md:self-start">
              <Settings className="text-primary h-4 w-4" />
              <span className="text-primary text-xs font-medium tracking-wide uppercase">
                Account Management
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-balance md:text-4xl">
              Settings & Preferences
            </h1>
            <p className="text-muted-foreground text-sm text-balance md:text-base">
              Manage your personal details, security configurations, and
              notification preferences to customize your experience.
            </p>
          </header>
        </div>
      </section>

      <div className="container">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 py-10 md:py-14 lg:flex-row">
          <aside className="shrink-0 lg:w-64">
            <SettingsSidebar items={settingsNavItems} />

            <Separator className="my-4" />

            <div className="space-y-1">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground w-full justify-start"
                onClick={() => logoutMutation.mutateAsync({})}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
