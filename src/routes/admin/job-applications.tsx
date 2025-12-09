import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

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
import { getAllJobApplicationsSchema } from "@/features/jobs/jobs.schema";
import { jobApplicationsTableColumns } from "@/features/jobs/components/job-applications-table-columns";

export const Route = createFileRoute("/admin/job-applications")({
  component: RouteComponent,
  validateSearch: getAllJobApplicationsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    await context.queryClient.prefetchQuery(
      api.jobApplications.all.queryOptions({ input: { query: search } }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  const { data, isPending } = useQuery(
    api.jobApplications.all.queryOptions({ input: { query: searchParams } }),
  );

  const applications = data?.items ?? [];
  const pageSize = data?.pageSize ?? searchParams.pageSize ?? 10;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminPageWrapper pageTitle="Job Applications">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>
              <p>Review and manage all job applications submitted by users.</p>
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/apply">Open apply page</Link>
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={jobApplicationsTableColumns}
            data={
              applications.map((app) => ({
                id: app.id,
                userId: app.userId,
                name: app.name,
                email: app.email,
                phone: app.phone,
                preferredCountries: app.preferredCountries,
                preferredPosition: app.preferredPosition,
                resumeFileId: app.resumeFileId,
                passportFileId: app.passportFileId,
                medicalReportFileId: app.medicalReportFileId,
                resumeFile: app.resumeFile ?? null,
                passportFile: app.passportFile ?? null,
                medicalReportFile: app.medicalReportFile ?? null,
                createdAt: new Date(app.createdAt),
                updatedAt: new Date(app.updatedAt),
              })) || []
            }
            isLoading={isPending}
            options={{
              pageCount: totalPages,
              initialState: {
                columnVisibility: { userId: false, updatedAt: false },
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
