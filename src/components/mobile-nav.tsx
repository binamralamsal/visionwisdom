import { Menu } from "lucide-react";

import { useState } from "react";

import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { navLinks, site } from "@/config/site";

export function MobileNav() {
  const [isSheetOpened, setIsSheetOpened] = useState(false);

  return (
    <Drawer open={isSheetOpened} onOpenChange={setIsSheetOpened}>
      <DrawerTrigger asChild>
        <Button className="md:hidden" variant="outline" size="icon">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="gap-0">
        <DrawerHeader>
          <DrawerTitle>{site.name}</DrawerTitle>
          <DrawerDescription>{site.description}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <ul className="flex flex-col gap-2">
            {navLinks.map((navLink) => (
              <li key={navLink.label}>
                <Link
                  to={navLink.href}
                  className="hover:text-primary block py-1 text-sm transition-all ease-in-out"
                  onClick={() => setIsSheetOpened(false)}
                  activeOptions={{ exact: navLink.href === "/" }}
                  activeProps={{ className: "text-primary font-medium" }}
                >
                  {navLink.label}
                </Link>
              </li>
            ))}

            {/* <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="link" asChild>
              <Link href="/#" onClick={() => setIsSheetOpened(false)}>
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/#" onClick={() => setIsSheetOpened(false)}>
                Sign Up
              </Link>
            </Button>
          </div> */}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
