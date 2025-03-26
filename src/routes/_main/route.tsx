import { Outlet, createFileRoute } from "@tanstack/react-router";

import { BottomNavigation } from "@/components/bottom-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/_main")({
  component: RouteComponent,
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
