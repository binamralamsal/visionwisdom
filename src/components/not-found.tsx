import { Link } from "@tanstack/react-router";

import { BottomNavigation } from "./bottom-navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function NotFound() {
  return (
    <>
      <SiteHeader />

      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
          <Link to="/" className="text-blue-500 underline hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
      <SiteFooter />
      <BottomNavigation />
    </>
  );
}
