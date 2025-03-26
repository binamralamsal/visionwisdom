import { Outlet, createFileRoute } from "@tanstack/react-router";

import { BottomNavigation } from "@/components/bottom-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import { useMediaQuery } from "@/hooks/use-media-query";

export const Route = createFileRoute("/_main")({
  component: RouteComponent,
});

function RouteComponent() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop && <SiteHeader />}
      <Outlet />
      <SiteFooter />
      {!isDesktop && <BottomNavigation />}
    </>
  );
}
