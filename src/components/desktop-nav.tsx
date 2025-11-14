import { Link } from "@tanstack/react-router";

import { Button } from "./ui/button";

import { navLinks } from "@/config/site";

export function DesktopNav() {
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

      {/* <nav className="hidden md:block">
        <ul className="flex gap-2">
          <li>
            <Button variant="link">Login</Button>
          </li>
          <li>
            <Button>Sign Up</Button>
          </li>
        </ul>
      </nav> */}
    </>
  );
}
