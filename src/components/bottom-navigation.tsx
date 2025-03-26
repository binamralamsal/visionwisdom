import { Briefcase, ContactIcon, Home, Info } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { cn } from "@/util/cn";

export function BottomNavigation() {
  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: "/",
    },
    {
      name: "Available Jobs",
      icon: Briefcase,
      href: "/jobs",
    },
    {
      name: "About",
      icon: Info,
      href: "/about",
    },
    {
      name: "Contact",
      icon: ContactIcon,
      href: "/contact",
    },
  ];

  return (
    <div className="bg-background supports-[backdrop-filter]:bg-background/85 sticky bottom-0 left-0 z-50 border-t py-3 backdrop-blur">
      <div className="grid grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="group grid place-items-center rounded-full"
            activeOptions={{ exact: item.href === "/" }}
            activeProps={{ className: "active" }}
          >
            <div className="group-[.active]:bg-primary mb-1 rounded-full px-4 py-1 transition-all duration-500 group-active:bg-gray-400">
              <item.icon
                className={cn(
                  "group-[.active]:text-primary-foreground h-6 w-6 transition-all duration-300 ease-in-out",
                )}
              />
            </div>

            <span className="group-[.active]:text-primary text-sm font-medium">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
