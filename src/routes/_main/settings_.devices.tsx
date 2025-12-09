import { toast } from "sonner";
import {
  CheckCircle2,
  MapPin,
  Monitor,
  ShieldAlertIcon,
  Smartphone,
  Tablet,
  XCircle,
} from "lucide-react";

import { Fragment } from "react/jsx-runtime";

import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SettingsLayout } from "@/components/settings-layout";
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { api } from "@/orpc/client";

function getDeviceIcon(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    return Smartphone;
  }
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return Tablet;
  }
  return Monitor;
}

export const Route = createFileRoute("/_main/settings_/devices")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery(
    api.users.profile.get.queryOptions(),
  );

  const terminateSessionMutation = useMutation(
    api.users.profile.terminateSession.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(api.users.profile.get.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message || "Failed to terminate session");
      },
    }),
  );

  if (isLoading) {
    return (
      <SettingsLayout
        title="Devices & Sessions"
        description="Manage your active sessions and devices"
      >
        <div className="flex flex-col gap-4 py-8">
          <div className="space-y-2">
            <div className="bg-muted h-4 w-40 animate-pulse rounded" />
            <div className="bg-muted h-3 w-64 animate-pulse rounded" />
          </div>
          <Item className="animate-pulse">
            <ItemMedia variant="icon">
              <Monitor className="h-5 w-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                <span className="bg-muted inline-block h-4 w-32 rounded" />
              </ItemTitle>
              <ItemDescription>
                <span className="bg-muted inline-block h-3 w-48 rounded" />
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </SettingsLayout>
    );
  }

  const sessions = profileData?.sessions || [];
  const activeSessions = sessions.filter((s) => s.isCurrent);
  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <SettingsLayout
      title="Devices & Sessions"
      description="Manage where you're logged in and terminate suspicious sessions"
    >
      <div className="space-y-8">
        {activeSessions.length > 0 && (
          <section className="space-y-3">
            <Field orientation="horizontal" className="justify-between">
              <FieldSet>
                <FieldLegend>Current device</FieldLegend>
                <FieldDescription>
                  You’re signed in on this device right now.
                </FieldDescription>
              </FieldSet>
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-green-500/40 bg-green-500/5 text-xs text-green-600 dark:text-green-400"
              >
                <CheckCircle2 className="h-3 w-3" />
                Secure
              </Badge>
            </Field>

            <Item
              variant="muted"
              className="mt-4 border border-green-500/20 bg-linear-to-r from-green-500/5 to-emerald-500/5"
            >
              {activeSessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.userAgent);
                return (
                  <ItemContent
                    key={session.id}
                    className="flex flex-row items-start gap-4"
                  >
                    <ItemMedia variant="icon">
                      <div className="bg-background rounded-lg p-2 shadow-sm">
                        <DeviceIcon className="h-6 w-6" />
                      </div>
                    </ItemMedia>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <ItemTitle className="text-sm font-semibold">
                          {session.browser || "Unknown Browser"}
                        </ItemTitle>
                        <Badge
                          variant="outline"
                          className="border-green-500/40 bg-green-500/10 text-xs text-green-700 dark:text-green-300"
                        >
                          This device
                        </Badge>
                      </div>
                      <ItemDescription className="text-xs">
                        {session.os || "Unknown OS"}
                      </ItemDescription>
                      <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {[session.city, session.region, session.country]
                              .filter(Boolean)
                              .join(", ") || "Unknown location"}
                          </span>
                        </div>
                        <div className="bg-background/60 rounded-full px-2 py-0.5">
                          IP: {session.ip}
                        </div>
                      </div>
                    </div>
                  </ItemContent>
                );
              })}
            </Item>
          </section>
        )}

        <Separator />

        {otherSessions.length > 0 && (
          <section className="space-y-3">
            <FieldSet>
              <FieldLegend>Other devices</FieldLegend>
              <FieldDescription>
                Devices where you’re also logged in. Terminate any device you
                don’t recognize.
              </FieldDescription>
            </FieldSet>

            <ItemGroup className="bg-card overflow-hidden rounded-xl border">
              {otherSessions.map((session, index) => {
                const DeviceIcon = getDeviceIcon(session.userAgent);
                const isLast = index === otherSessions.length - 1;

                return (
                  <Fragment key={session.id}>
                    <Item className="flex items-start gap-4">
                      <ItemMedia variant="icon">
                        <div className="bg-accent/70 rounded-lg p-2">
                          <DeviceIcon className="h-5 w-5" />
                        </div>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className="text-sm font-semibold">
                          {session.browser || "Unknown Browser"}
                        </ItemTitle>
                        <ItemDescription className="text-xs">
                          {session.os || "Unknown OS"}
                        </ItemDescription>
                        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {[session.city, session.region, session.country]
                                .filter(Boolean)
                                .join(", ") || "Unknown location"}
                            </span>
                          </div>
                          <div>IP: {session.ip}</div>
                        </div>
                      </ItemContent>
                      <ItemActions className="shrink-0">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <XCircle className="mr-2 h-4 w-4" />
                              Terminate
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Terminate this session?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will log out this device. You’ll need to
                                sign in again to use it. This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  terminateSessionMutation.mutateAsync({
                                    params: { id: session.id },
                                  })
                                }
                                disabled={terminateSessionMutation.isPending}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {terminateSessionMutation.isPending
                                  ? "Terminating..."
                                  : "Terminate session"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </ItemActions>
                    </Item>
                    {!isLast && <ItemSeparator />}
                  </Fragment>
                );
              })}
            </ItemGroup>
          </section>
        )}

        {sessions.length === 0 && (
          <section>
            <Item variant="muted" className="py-8">
              <ItemContent className="flex flex-col items-center gap-3 text-center">
                <ItemMedia variant="icon">
                  <Smartphone className="h-10 w-10 opacity-50" />
                </ItemMedia>
                <div className="space-y-1">
                  <ItemTitle>No active sessions</ItemTitle>
                  <ItemDescription>
                    You’re not currently logged in on any other devices.
                  </ItemDescription>
                </div>
              </ItemContent>
            </Item>
          </section>
        )}

        <section>
          <Item
            variant="muted"
            className="border border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/20"
          >
            <ItemHeader className="flex items-start gap-3">
              <ItemMedia variant="icon">
                <ShieldAlertIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Security tip
                </ItemTitle>
                <ItemDescription className="text-xs text-blue-800 dark:text-blue-200">
                  Always terminate sessions on devices you don’t recognize or no
                  longer use. If you notice suspicious activity, change your
                  password immediately and review your account security
                  settings.
                </ItemDescription>
              </ItemContent>
            </ItemHeader>
          </Item>
        </section>
      </div>
    </SettingsLayout>
  );
}
