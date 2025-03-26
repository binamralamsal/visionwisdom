import { Outlet, createFileRoute } from "@tanstack/react-router";

import { BottomNavigation } from "@/components/bottom-navigation";
import { NotFound } from "@/components/not-found";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/_main")({
  component: RouteComponent,
  notFoundComponent: () => <NotFound />,
});

function RouteComponent() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <BottomNavigation />
    </>
  );
}
