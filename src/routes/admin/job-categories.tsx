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
import { getAllJobCategoriesSchema } from "@/features/jobs/jobs.schema";
import { categoriesTableColumns } from "@/features/jobs/components/job-categories-table-columns";

export const Route = createFileRoute("/admin/job-categories")({
  component: RouteComponent,
  validateSearch: getAllJobCategoriesSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(
      api.jobs.categories.all.queryOptions({ input: { query: search } }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const { data, isPending } = useQuery(
    api.jobs.categories.all.queryOptions({ input: { query: searchParams } }),
  );

  return (
    <AdminPageWrapper pageTitle="All Categories">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">Job Categories</CardTitle>
            <CardDescription>
              <p>Here are the list of job categories</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/job-categories/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={categoriesTableColumns}
            data={data?.categories || []}
            isLoading={isPending}
            options={{
              pageCount: data?.pagination.totalPages,
              initialState: {
                columnVisibility: { updatedAt: false },
                sorting: Object.entries(searchParams.sort).map(
                  ([key, value]) => ({
                    desc: value === "desc",
                    id: key,
                  }),
                ),
              },
            }}
            skeletonColumnWidths={["9%", "30%", "30%", "20%"]}
          />
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}
