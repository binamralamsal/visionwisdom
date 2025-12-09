import {
  BoxesIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  Contact2Icon,
  FilePlus2Icon,
  HomeIcon,
  IdCardIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  PackagePlusIcon,
  TicketPlusIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { ReactNode, Suspense } from "react";

import { Link, LinkProps } from "@tanstack/react-router";

import { AdminNavUser } from "./admin-nav-user";
import { AdminSearchCommandMenu } from "./admin-search-command-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export interface SidebarMenuItem {
  title: string;
  url: LinkProps["to"] | (string & {});
  isActive?: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items?: (Omit<SidebarMenuItem, "icon"> & {
    icon?: SidebarMenuItem["icon"];
  })[];
  exact?: boolean;
}

export interface SidebarGroupItem {
  label: string;
  action?: ReactNode;
  items: SidebarMenuItem[];
}

export const sidebarItems: SidebarGroupItem[] = [
  {
    label: "Dashboard",
    items: [
      {
        title: "Home",
        url: "/admin",
        icon: HomeIcon,
      },
      {
        title: "Contact Entries",
        url: "/admin/contact-entries",
        icon: Contact2Icon,
      },
    ],
  },
  {
    label: "User Management",
    action: <Link to="/admin/users/new">+</Link>,
    items: [
      {
        title: "All Users",
        url: "/admin/users",
        icon: UsersIcon,
      },
      { title: "Add New User", url: "/admin/users/new", icon: UserPlusIcon },
    ],
  },
  {
    label: "Content Management",
    items: [
      {
        title: "Blog Categories",
        url: "/admin/blog-categories",
        icon: BoxesIcon,
        exact: false,
        items: [
          {
            title: "All Categories",
            url: "/admin/blog-categories",
            icon: BoxesIcon,
          },
          {
            title: "Add New Category",
            url: "/admin/blog-categories/new",
            icon: PackagePlusIcon,
          },
        ],
      },
      {
        title: "Blogs",
        url: "/admin/blogs",
        icon: NewspaperIcon,
        exact: false,
        items: [
          { title: "All Blogs", url: "/admin/blogs", icon: NewspaperIcon },
          {
            title: "Add New Blog",
            url: "/admin/blogs/new",
            icon: FilePlus2Icon,
          },
        ],
      },
    ],
  },
  {
    label: "Job Management",
    items: [
      {
        title: "Job Categories",
        url: "/admin/job-categories",
        icon: BoxesIcon,
        exact: false,
        items: [
          {
            title: "All Categories",
            url: "/admin/job-categories",
            icon: BoxesIcon,
          },
          {
            title: "Add New Category",
            url: "/admin/job-categories/new",
            icon: PackagePlusIcon,
          },
        ],
      },
      {
        title: "Jobs",
        url: "/admin/jobs",
        icon: BriefcaseIcon,
        exact: false,
        items: [
          { title: "All Jobs", url: "/admin/jobs", icon: BriefcaseIcon },
          {
            title: "Add New Job",
            url: "/admin/jobs/new",
            icon: TicketPlusIcon,
          },
        ],
      },
      {
        title: "Job Applications",
        url: "/admin/job-applications",
        icon: IdCardIcon,
      },
    ],
  },
];

export function AdminSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/*<LogoWithoutText
                    className="size-4"
                    mono
                    monoFillClass="fill-white dark:fill-black"
                  />*/}
                  <LayoutDashboardIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">VisionWisdom</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <AdminSearchCommandMenu />
      </SidebarHeader>
      <SidebarContent>
        {sidebarItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            {group.action ? (
              <SidebarGroupAction asChild>{group.action}</SidebarGroupAction>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link
                          to={item.url}
                          activeProps={{ "data-active": true }}
                          activeOptions={{
                            exact: item.exact ?? true,
                            includeSearch: false,
                          }}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.items?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRightIcon />
                              <span className="sr-only">Toggle</span>
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link
                                      to={subItem.url}
                                      activeProps={{ "data-active": true }}
                                      activeOptions={{
                                        exact: subItem.exact ?? true,
                                        includeSearch: false,
                                      }}
                                    >
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div>Loading</div>}>
          <AdminNavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarFooter />
    </Sidebar>
  );
}
