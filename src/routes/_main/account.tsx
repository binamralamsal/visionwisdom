import { BriefcaseIcon, FileBadge2, FileHeart, FileText } from "lucide-react";

import * as React from "react";

import { useQuery } from "@tanstack/react-query";
import {
  Link,
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

import { cn } from "@/util/cn";
import { api } from "@/orpc/client";

export const Route = createFileRoute("/_main/account")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(
        api.users.profile.get.queryOptions(),
      );
    } catch {
      throw redirect({
        to: "/login",
        search: { redirect_url: "/applications" },
      });
    }
  },
});

function RouteComponent() {
  const { data, isLoading, isError, error } = useQuery(
    api.jobApplications.mine.queryOptions({
      input: { query: {} },
    }),
  );

  const applications = data?.items ?? [];

  return (
    <main className="min-h-screen">
      <section className="bg-background border-b py-10 md:py-14">
        <div className="container">
          <header className="mx-auto flex max-w-4xl flex-col gap-4 text-center md:text-left">
            <div className="bg-primary/10 inline-flex items-center justify-center gap-2 self-center rounded-full px-3 py-1 md:self-start">
              <BriefcaseIcon className="text-primary h-4 w-4" />
              <span className="text-primary text-xs font-medium tracking-wide uppercase">
                My account
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-balance md:text-4xl">
              My Job Applications
            </h1>
            <p className="text-muted-foreground text-sm text-balance md:text-base">
              View all the job applications you&apos;ve submitted. You can
              review your preferences and attached documents at a glance.
            </p>
          </header>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <FieldGroup className="mx-auto max-w-4xl">
          <FieldSet>
            <FieldLegend>Applications</FieldLegend>
            <FieldDescription>
              These are the applications you&apos;ve submitted using your
              account.
            </FieldDescription>

            {isLoading && (
              <div className="flex flex-col gap-4">
                <div className="bg-muted h-4 w-40 rounded" />
                <div className="space-y-3">
                  <div className="bg-muted/60 h-20 rounded-lg" />
                  <div className="bg-muted/40 h-20 rounded-lg" />
                </div>
              </div>
            )}

            {isError && !isLoading && (
              <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-lg border px-4 py-3 text-sm">
                {error?.message || "Failed to load applications."}
              </div>
            )}

            {!isLoading && !isError && applications.length === 0 && (
              <div className="bg-card/40 flex flex-col items-center gap-3 rounded-lg border px-6 py-10 text-center">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <BriefcaseIcon className="text-primary h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    You haven&apos;t applied yet
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Once you submit a job application, it will appear here with
                    your details and uploaded documents.
                  </p>
                </div>
                <Button asChild size="sm" className="mt-2">
                  <Link to="/apply">Apply for jobs</Link>
                </Button>
              </div>
            )}

            {/* List */}
            {!isLoading && !isError && applications.length > 0 && (
              <ul className="space-y-4" aria-label="Job applications">
                {applications.map((app) => {
                  const hasResume = Boolean(app.resumeFileId);
                  const hasPassport = Boolean(app.passportFileId);
                  const hasMedical = Boolean(app.medicalReportFileId);

                  const createdAt = app.createdAt
                    ? new Date(app.createdAt)
                    : null;

                  return (
                    <li key={app.id}>
                      <article className="bg-card/40 flex flex-col gap-4 rounded-lg border px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5 md:py-5">
                        {/* Main info */}
                        <div className="flex-1 space-y-2">
                          <header className="space-y-1">
                            <h2 className="text-sm font-semibold">
                              {app.preferredPosition || "Job application"}
                            </h2>
                            <p className="text-muted-foreground text-xs">
                              {app.name} · {app.email} · {app.phone}
                            </p>
                          </header>

                          <div className="text-muted-foreground space-y-1 text-xs">
                            {app.preferredCountries && (
                              <p>
                                <span className="font-medium">
                                  Preferred countries:
                                </span>{" "}
                                {app.preferredCountries}
                              </p>
                            )}
                            {createdAt && (
                              <p>
                                <span className="font-medium">Applied on:</span>{" "}
                                {createdAt.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Documents summary */}
                        <div className="flex flex-wrap items-center gap-2 md:w-64 md:justify-end">
                          <DocPill
                            icon={FileText}
                            label="CV"
                            active={hasResume}
                          />
                          <DocPill
                            icon={FileBadge2}
                            label="Passport"
                            active={hasPassport}
                          />
                          <DocPill
                            icon={FileHeart}
                            label="Medical"
                            active={hasMedical}
                          />
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </FieldSet>
        </FieldGroup>
      </section>
    </main>
  );
}

function DocPill({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs",
        active
          ? "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "border-muted bg-muted/40 text-muted-foreground",
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
      <span className="sr-only">{active ? "uploaded" : "missing"}</span>
      {!active && (
        <span aria-hidden className="text-[10px] opacity-70">
          —
        </span>
      )}
    </span>
  );
}
