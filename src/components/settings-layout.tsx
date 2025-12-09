import { toast } from "sonner";
import { LogOut, Settings, Smartphone, User } from "lucide-react";

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
    <div className="container max-w-7xl py-6 lg:py-10">
      <div className="mb-6 flex items-center gap-4">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Separator className="mb-6" />

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
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

        {/* Main Content */}
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
  );
}
