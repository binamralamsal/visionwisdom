import { ThemeProvider } from "next-themes";

import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { api } from "@/orpc/client";

const getSidebarStateFn = createServerFn({ method: "GET" }).handler(() => {
  const sidebarState = getCookie("sidebar_state");
  const defaultOpen = sidebarState ? sidebarState === "true" : true;

  return { defaultOpen };
});

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async ({ context, location: { pathname } }) => {
    try {
      const response = await context.queryClient.ensureQueryData(
        api.users.current.user.queryOptions(),
      );

      if (response.user.role !== "admin") throw redirect({ to: "/" });
    } catch {
      throw redirect({ to: "/login", search: { redirect_url: pathname } });
    }
  },
  loader: async () => {
    return await getSidebarStateFn();
  },
  notFoundComponent: () => <div>Not Found</div>,
});

function RouteComponent() {
  const { defaultOpen } = Route.useLoaderData();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
