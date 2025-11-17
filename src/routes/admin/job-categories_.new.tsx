import { createFileRoute } from "@tanstack/react-router";

import { JobCategoryForm } from "@/features/jobs/components/job-category-form";

export const Route = createFileRoute("/admin/job-categories_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <JobCategoryForm />;
}
