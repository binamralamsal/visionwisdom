import { ArchiveIcon, CircleCheckIcon, FileIcon } from "lucide-react";

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
import { getAllBlogsSchema } from "@/features/blogs/blogs.schema";
import { blogsTableColumns } from "@/features/blogs/components/blogs-table-columns";

export const Route = createFileRoute("/admin/blogs")({
  component: RouteComponent,
  validateSearch: getAllBlogsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(
      api.blogs.all.queryOptions({ input: { query: search } }),
    );
    context.queryClient.prefetchQuery(
      api.blogs.categories.all.queryOptions({
        input: { query: { page: 1, pageSize: 1000 } },
      }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  const { data, isPending } = useQuery(
    api.blogs.all.queryOptions({ input: { query: searchParams } }),
  );

  const { data: categoriesData } = useQuery(
    api.blogs.categories.all.queryOptions({
      input: { query: { page: 1, pageSize: 1000 } },
    }),
  );

  return (
    <AdminPageWrapper pageTitle="All Blogs">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Blogs</CardTitle>
            <CardDescription>
              <p>Here are the list of blogs</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/blogs/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={blogsTableColumns}
            data={
              data?.blogs.map((blog) => ({
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt,
                id: blog.id,
                slug: blog.slug,
                title: blog.title,
                status: blog.status,
                category: blog.categoryName,
                author: blog.author?.name,
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

const blogStatus = ["published", "archived", "draft"];

const blogStatusIcons: Record<
  (typeof blogStatus)[number],
  ComponentType<{ className?: string }>
> = {
  draft: FileIcon,
  published: CircleCheckIcon,
  archived: ArchiveIcon,
};

const statuses = blogStatus.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
  icon: blogStatusIcons[status],
}));
