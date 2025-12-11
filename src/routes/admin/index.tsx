import { z } from "zod";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Briefcase,
  FileText,
  MessageSquare,
  Search,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import React, { useEffect } from "react";

import { useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/form/hooks";
import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { api } from "@/orpc/client";

const addFeaturedJobSchema = z.object({
  search: z.string().min(2, "Enter at least 2 characters to search"),
  selectedJobId: z.number({
    error: "Please select a job to feature",
  }),
});

type AddFeaturedJobInput = z.infer<typeof addFeaturedJobSchema>;

interface FeaturedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FeaturedModal({ open, onOpenChange }: FeaturedModalProps) {
  const queryClient = useQueryClient();

  const toggleFeatured = useMutation({
    ...api.admin.toggleJobFeatured.mutationOptions(),
    onSuccess: (data) => {
      toast.success(
        (data as { message?: string }).message ?? "Job featured successfully",
      );
      queryClient.invalidateQueries(
        api.jobs.all.queryOptions({
          input: {
            query: {
              isFeatured: ["yes"],
              status: ["published"],
            },
          },
        }),
      );
      queryClient.invalidateQueries(api.admin.stats.queryOptions());
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error("Failed to update featured status");
    },
  });

  const form = useAppForm({
    defaultValues: {
      search: "",
      selectedJobId: undefined as unknown as number,
    } satisfies AddFeaturedJobInput,
    validators: {
      onChange: addFeaturedJobSchema,
    },
    onSubmit: async ({ value }) => {
      await toggleFeatured.mutateAsync({
        params: { id: value.selectedJobId },
      });
    },
  });

  const searchValue = useStore(form.store, (store) => store.values.search);

  const { data: searchResults, isFetching: searching } = useQuery(
    api.jobs.all.queryOptions({
      input: {
        query: {
          search: searchValue,
          page: 1,
          pageSize: 8,
          isFeatured: ["no"],
        },
      },
      enabled: open && searchValue.trim().length > 1,
      keepPreviousData: true,
    }),
  );

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const jobs = searchResults?.jobs ?? [];
  const showNoResults =
    !searching && searchValue.trim().length > 1 && jobs.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>Add Job to Featured</DialogTitle>
          <DialogDescription>
            Search for a job and add it to your featured listings
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col space-y-4">
            <form.AppField
              name="search"
              children={(field) => (
                <field.FormField>
                  <field.FormLabel>
                    Search by title, company, or location
                  </field.FormLabel>
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <field.FormInput
                      placeholder="Start typing (min 2 chars)..."
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                  <field.FormError />
                </field.FormField>
              )}
            />

            <form.AppField
              name="selectedJobId"
              children={(field) => (
                <field.FormField className="flex min-h-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 overflow-auto rounded-md border p-2">
                    {searching && (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span className="text-sm">Searching...</span>
                        </div>
                      </div>
                    )}

                    {showNoResults && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Briefcase className="text-muted-foreground mb-2 h-8 w-8" />
                        <p className="text-muted-foreground text-sm">
                          No jobs found. Try different keywords or make sure
                          there are non-featured jobs available.
                        </p>
                      </div>
                    )}

                    {!searching && jobs.length > 0 && (
                      <div className="space-y-2">
                        {jobs.map((job) => (
                          <label
                            key={job.id}
                            className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
                          >
                            <input
                              type="radio"
                              name="selectedJobId"
                              value={job.id}
                              checked={
                                field.state.value?.toString() ===
                                job.id.toString()
                              }
                              onChange={() => field.handleChange(job.id)}
                              className="h-4 w-4"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">
                                {job.title}
                              </div>
                              <div className="text-muted-foreground truncate text-sm">
                                {job.company} • {job.location}
                              </div>
                            </div>
                            {job.salary && (
                              <div className="text-sm font-medium whitespace-nowrap text-green-600">
                                {job.salary}
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <field.FormError />
                </field.FormField>
              )}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={toggleFeatured.isPending}>
              {toggleFeatured.isPending ? "Adding..." : "Add to Featured"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
  loader: async ({ context }: { context: { queryClient: QueryClient } }) => {
    context.queryClient.prefetchQuery(api.admin.stats.queryOptions());
    context.queryClient.prefetchQuery(
      api.jobs.all.queryOptions({
        input: {
          query: {
            isFeatured: ["yes"],
            status: ["published"],
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: stats } = useQuery(api.admin.stats.queryOptions());
  const { data: featuredJobs } = useQuery(
    api.jobs.all.queryOptions({
      input: {
        query: {
          isFeatured: ["yes"],
          status: ["published"],
        },
      },
    }),
  );

  const toggleFeatured = useMutation({
    ...api.admin.toggleJobFeatured.mutationOptions(),
    onSuccess: (data) => {
      toast.success(
        (data as { message?: string }).message ?? "Updated successfully",
      );
      queryClient.invalidateQueries(
        api.jobs.all.queryOptions({
          input: {
            query: {
              isFeatured: ["yes"],
              status: ["published"],
            },
          },
        }),
      );
      queryClient.invalidateQueries(api.admin.stats.queryOptions());
    },
    onError: () => {
      toast.error("Failed to update featured status");
    },
  });

  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const adminCount =
    stats?.usersByRole.find((r) => r.role === "admin")?.count ?? 0;
  const userCount =
    stats?.usersByRole.find((r) => r.role === "user")?.count ?? 0;

  const applicationChartData =
    stats?.jobApplicationsByDay.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      applications: d.count,
    })) ?? [];

  const contactChartData =
    stats?.contactEntriesByDay.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      contacts: d.count,
    })) ?? [];

  const applicationChartConfig = {
    applications: {
      label: "Applications",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const contactChartConfig = {
    contacts: {
      label: "Contact Queries",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <AdminPageWrapper pageTitle="Dashboard">
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.counts.users}</div>
              <p className="text-muted-foreground text-xs">
                {adminCount} admins, {userCount} users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.counts.jobs}</div>
              <p className="text-muted-foreground text-xs">
                {stats?.counts.featuredJobs} featured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Job Applications
              </CardTitle>
              <UserCheck className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.counts.jobApplications}
              </div>
              <p className="text-muted-foreground text-xs">
                Total applications received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contact Queries
              </CardTitle>
              <MessageSquare className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.counts.contactEntries}
              </div>
              <p className="text-muted-foreground text-xs">
                Total queries received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <FileText className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.counts.blogs}</div>
              <p className="text-muted-foreground text-xs">
                Published and draft posts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>
                Daily applications over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={applicationChartConfig}>
                <AreaChart
                  data={applicationChartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="applications"
                    type="natural"
                    fill="var(--color-applications)"
                    fillOpacity={0.4}
                    stroke="var(--color-applications)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Queries</CardTitle>
              <CardDescription>
                Daily contact queries over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={contactChartConfig}>
                <AreaChart
                  data={contactChartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="contacts"
                    type="natural"
                    fill="var(--color-contacts)"
                    fillOpacity={0.4}
                    stroke="var(--color-contacts)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Featured Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Featured Jobs</CardTitle>
                <CardDescription>
                  Manage jobs that appear prominently on the site
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setAddModalOpen(true)}
                className="gap-2"
              >
                <Star className="h-4 w-4" />
                Add Featured Job
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {featuredJobs && featuredJobs.jobs.length > 0 ? (
              <div className="space-y-3">
                {featuredJobs.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="hover:bg-accent/50 flex items-start justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="mr-4 min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-semibold">{job.title}</h4>
                        <Badge variant="secondary" className="shrink-0">
                          <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                          Featured
                        </Badge>
                      </div>
                      <p className="text-muted-foreground truncate text-sm">
                        {job.company} • {job.location}
                      </p>
                      {job.salary && (
                        <p className="text-sm font-medium text-green-600">
                          {job.salary}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleFeatured.mutate({ params: { id: job.id } })
                      }
                      disabled={toggleFeatured.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Star className="text-muted-foreground mb-3 h-12 w-12" />
                <p className="text-muted-foreground mb-1 font-medium">
                  No featured jobs yet
                </p>
                <p className="text-muted-foreground text-sm">
                  Click the button above to add jobs to your featured listings
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Job Modal */}
        <FeaturedModal open={addModalOpen} onOpenChange={setAddModalOpen} />

        {/* Quick Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              Quick summary of platform activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">User Growth</p>
                  <p className="text-2xl font-bold">{userCount}</p>
                  <p className="text-muted-foreground text-xs">
                    Regular users registered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Jobs</p>
                  <p className="text-2xl font-bold">{stats?.counts.jobs}</p>
                  <p className="text-muted-foreground text-xs">
                    Total job listings available
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  );
}
