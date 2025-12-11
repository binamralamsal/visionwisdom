import { ArrowLeftIcon } from "lucide-react";

import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { api } from "@/orpc/client";
import { JobForm } from "@/features/jobs/components/job-form";

export const Route = createFileRoute("/admin/jobs_/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.ensureQueryData(
        api.jobs.get.queryOptions({ input: { params } }),
      );
    } catch {
      throw notFound();
    }

    queryClient.prefetchQuery(
      api.jobs.categories.all.queryOptions({
        input: {
          query: {
            page: 1,
            pageSize: 100,
          },
        },
      }),
    );
  },
  notFoundComponent: () => <JobNotFound />,
});

function RouteComponent() {
  const params = Route.useParams();

  const { data: job } = useSuspenseQuery(
    api.jobs.get.queryOptions({ input: { params } }),
  );

  const {
    data: { categories },
  } = useSuspenseQuery(
    api.jobs.categories.all.queryOptions({
      input: {
        query: {
          page: 1,
          pageSize: 100,
        },
      },
    }),
  );

  return (
    <JobForm
      id={job.id}
      file={job?.file ?? null}
      categories={categories}
      defaultValues={{
        title: job.title,
        slug: job.slug,
        description: job.description,
        company: job.company ?? null,
        location: job.location ?? null,
        gender: job.gender,
        salary: job.salary ?? null,
        contractLength: job.contractLength ?? null,
        workingHours: job.workingHours ?? null,
        experience: job.experience ?? null,
        documentsRequired: job.documentsRequired ?? null,
        status: job.status,
        categoryId: job.category?.id ?? null,
        fileId: job.file?.id ?? null,
        isFeatured: job.isFeatured ?? false,
      }}
    />
  );
}

function JobNotFound() {
  return (
    <AdminPageWrapper
      pageTitle="Edit Job"
      breadcrumbs={[{ label: "All Jobs", href: "/admin/jobs" }]}
    >
      <div className="grid min-h-[80vh] place-items-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Job Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sorry, we couldn't find the job you're looking for. It may have
              been deleted or never existed.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/admin/jobs">
              <ArrowLeftIcon size={16} />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    </AdminPageWrapper>
  );
}
