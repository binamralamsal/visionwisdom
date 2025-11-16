import { ArrowLeftIcon } from "lucide-react";

import { Link, notFound } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { AdminPageWrapper } from "@/components/admin-page-wrapper";

import { api } from "@/orpc/client";
import { CategoryForm } from "@/features/blogs/components/category-form";

export const Route = createFileRoute("/admin/blog-categories_/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.ensureQueryData(
        api.blogs.categories.get.queryOptions({
          input: { params },
          placeholderData: keepPreviousData,
        }),
      );
    } catch {
      throw notFound();
    }
  },
  notFoundComponent: () => <CategoryNotFound />,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data: category } = useSuspenseQuery(
    api.blogs.categories.get.queryOptions({
      input: { params },
      placeholderData: keepPreviousData,
    }),
  );
  if (!category) return <CategoryNotFound />;

  return <CategoryForm defaultValues={category} id={category.id} />;
}

function CategoryNotFound() {
  return (
    <AdminPageWrapper
      pageTitle="Edit Category"
      breadcrumbs={[
        { label: "All Categories", href: "/admin/blog-categories" },
      ]}
    >
      <div className="grid min-h-[80vh] place-items-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Category Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sorry, we couldn&apos;t find the category you&apos;re looking for.
              It may have been deleted or never existed.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/admin/blog-categories">
              <ArrowLeftIcon size={16} />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    </AdminPageWrapper>
  );
}
