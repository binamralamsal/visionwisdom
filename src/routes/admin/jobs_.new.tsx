import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { api } from "@/orpc/client";
import { JobForm } from "@/features/jobs/components/job-form";

export const Route = createFileRoute("/admin/jobs_/new")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(
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
});

function RouteComponent() {
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

  return <JobForm categories={categories} />;
}
