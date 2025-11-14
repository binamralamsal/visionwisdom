import { Link, createFileRoute } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
import { getAllUsersSchema } from "@/features/auth/auth.schema";
import { userTableColumns } from "@/features/auth/components/user-table-columns";

export const Route = createFileRoute("/admin/users")({
  component: RouteComponent,
  validateSearch: getAllUsersSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(
      api.users.admin.all.queryOptions({ input: { query: search } }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const { data, isPending } = useQuery(
    api.users.admin.all.queryOptions({
      input: { query: searchParams },
      placeholderData: keepPreviousData,
    }),
  );

  return (
    <AdminPageWrapper pageTitle="All Users">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>
              <p>Here are the list of users</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/users/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={userTableColumns}
            data={data?.users || []}
            isLoading={isPending}
            filters={[
              {
                accessorKey: "role",
                queryKey: "role",
                title: "Roles",
                options: [
                  { label: "Admin", value: "admin" },
                  { label: "Normal User", value: "user" },
                ],
              },
            ]}
            options={{
              pageCount: data?.pagination.totalPages,
              initialState: {
                columnVisibility: { updatedAt: false },
                columnFilters: [
                  {
                    id: "role",
                    value: searchParams.role,
                  },
                ],
                sorting: Object.entries(searchParams.sort).map(
                  ([key, value]) => ({
                    desc: value === "desc",
                    id: key,
                  }),
                ),
              },
            }}
            skeletonColumnWidths={["9%", "20%", "35%", "10%", "18%"]}
          />
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}
