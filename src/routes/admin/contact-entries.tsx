import { createFileRoute } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
import { getAllContactEntriesSchema } from "@/features/contact-entries/contact-entries.schema";
import { contactEntriesTableColumns } from "@/features/contact-entries/components/contact-entries-table-columns";

export const Route = createFileRoute("/admin/contact-entries")({
  component: RouteComponent,
  validateSearch: getAllContactEntriesSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(
      api.contact.all.queryOptions({ input: { query: search } }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const { data, isPending } = useQuery(
    api.contact.all.queryOptions({
      input: { query: searchParams },
      placeholderData: keepPreviousData,
    }),
  );

  return (
    <AdminPageWrapper pageTitle="Contact Entries">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">Contact Entries</CardTitle>
            <CardDescription>
              <p>Here are the list of contact entries</p>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={contactEntriesTableColumns}
            data={data?.contactEntries || []}
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
          />
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}
