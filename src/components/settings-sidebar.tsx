import { LucideIcon } from "lucide-react";

import { Link, useMatchRoute } from "@tanstack/react-router";

import { cn } from "@/util/cn";

export interface SettingsNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

interface SettingsSidebarProps {
  items: SettingsNavItem[];
  className?: string;
}

export function SettingsSidebar({ items, className }: SettingsSidebarProps) {
  const matchRoute = useMatchRoute();

  return (
    <nav className={cn("space-y-1", className)}>
      {items.map((item) => {
        const isActive = matchRoute({ to: item.href });
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            to={item.href}
            resetScroll={false}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <div className="flex flex-col">
              <span>{item.title}</span>
              {item.description && (
                <span className="text-muted-foreground text-xs">
                  {item.description}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
