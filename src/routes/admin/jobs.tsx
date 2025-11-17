import {
  ArchiveIcon,
  CircleCheckIcon,
  CircleDotIcon,
  FileIcon,
  MarsIcon,
  VenusIcon,
} from "lucide-react";

import { ComponentType } from "react";

import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "@/orpc/client";
import { getAllJobsSchema } from "@/features/jobs/jobs.schema";
import { jobsTableColumns } from "@/features/jobs/components/jobs-table-columns";

export const Route = createFileRoute("/admin/jobs")({
  component: RouteComponent,
  validateSearch: getAllJobsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(
      api.jobs.all.queryOptions({ input: { query: search } }),
    );
    context.queryClient.prefetchQuery(
      api.jobs.categories.all.queryOptions({
        input: { query: { page: 1, pageSize: 1000 } },
      }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  const { data, isPending } = useQuery(
    api.jobs.all.queryOptions({ input: { query: searchParams } }),
  );

  const { data: categoriesData } = useQuery(
    api.jobs.categories.all.queryOptions({
      input: { query: { page: 1, pageSize: 1000 } },
    }),
  );

  return (
    <AdminPageWrapper pageTitle="All Jobs">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Jobs</CardTitle>
            <CardDescription>
              <p>Here are the list of jobs</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/jobs/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={jobsTableColumns}
            data={
              data?.jobs.map((job) => ({
                createdAt: job.createdAt,
                updatedAt: job.updatedAt,
                id: job.id,
                slug: job.slug,
                title: job.title,
                company: job.company,
                location: job.location,
                gender: job.gender,
                status: job.status,
                category: job.categoryName,
              })) || []
            }
            isLoading={isPending}
            filters={[
              {
                accessorKey: "status",
                queryKey: "status",
                title: "Status",
                options: statuses,
              },
              {
                accessorKey: "category",
                queryKey: "categories",
                title: "Category",
                options: (categoriesData?.categories || []).map((c) => ({
                  value: c.slug,
                  label: c.name,
                })),
              },
              {
                accessorKey: "gender",
                queryKey: "gender",
                title: "Gender",
                options: genders,
              },
            ]}
            options={{
              pageCount: data?.pagination.totalPages,
              initialState: {
                columnVisibility: { updatedAt: false, slug: false },
                sorting: Object.entries(searchParams.sort).map(
                  ([key, value]) => ({
                    desc: value === "desc",
                    id: key,
                  }),
                ),
              },
            }}
          />
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}

const jobStatuses = ["published", "archived", "draft", "closed"] as const;

const jobStatusIcons: Record<
  (typeof jobStatuses)[number],
  ComponentType<{ className?: string }>
> = {
  draft: FileIcon,
  published: CircleCheckIcon,
  archived: ArchiveIcon,
  closed: ArchiveIcon,
};

const statuses = jobStatuses.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
  icon: jobStatusIcons[status],
}));

const genderIcons: Record<
  "any" | "male" | "female",
  ComponentType<{ className?: string }>
> = {
  any: CircleDotIcon,
  male: MarsIcon,
  female: VenusIcon,
};

export const genders = [
  {
    value: "any",
    label: "Any",
    icon: genderIcons.any,
  },
  {
    value: "male",
    label: "Male",
    icon: genderIcons.male,
  },
  {
    value: "female",
    label: "Female",
    icon: genderIcons.female,
  },
];
