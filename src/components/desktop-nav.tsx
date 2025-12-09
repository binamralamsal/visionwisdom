import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatarMenu } from "@/components/user-avatar-menu";

import { api } from "@/orpc/client";
import { navLinks } from "@/config/site";
import { noRetryForUnauthorized } from "@/util/no-retry-for-unauthorized";

export function DesktopNav() {
  const { data, isPending } = useQuery(
    api.users.current.user.queryOptions({
      retry: noRetryForUnauthorized,
    }),
  );

  return (
    <>
      <nav className="hidden md:block">
        <ul className="flex">
          {navLinks.map((navLink) => (
            <li key={navLink.label}>
              <Button
                variant="link"
                className="text-foreground hover:text-primary p-4 text-sm transition-all ease-in-out"
                asChild
              >
                <Link
                  to={navLink.href}
                  activeOptions={{ exact: navLink.href === "/" }}
                  activeProps={{ className: "text-primary font-medium" }}
                >
                  {navLink.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="hidden md:block">
        <div className="flex min-w-40 justify-end">
          {isPending ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-18.5" />
              <Skeleton className="h-9 w-20" />
            </div>
          ) : data?.user ? (
            <UserAvatarMenu user={data.user} />
          ) : (
            <ul className="flex gap-2">
              <li>
                <Button variant="link" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </li>
              <li>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
}
