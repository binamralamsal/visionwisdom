import { createFileRoute } from "@tanstack/react-router";

import { CategoryForm } from "@/features/blogs/components/category-form";

export const Route = createFileRoute("/admin/blog-categories_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CategoryForm />;
}
