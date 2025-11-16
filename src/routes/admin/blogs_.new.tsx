import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { api } from "@/orpc/client";
import { BlogForm } from "@/features/blogs/components/blog-form";

export const Route = createFileRoute("/admin/blogs_/new")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(
      api.blogs.categories.all.queryOptions({
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
    api.blogs.categories.all.queryOptions({
      input: {
        query: {
          page: 1,
          pageSize: 100,
        },
      },
    }),
  );

  return <BlogForm categories={categories} />;
}
