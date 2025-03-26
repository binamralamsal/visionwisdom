import { Outlet, createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/_main")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
}
