import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/orpc/client";
import { site } from "@/config/site";

export function SiteFooter() {
  const {
    data: { categories },
  } = useSuspenseQuery(
    api.jobs.categories.all.queryOptions({
      input: { query: { page: 1, pageSize: 6 } },
    }),
  );
  return (
    <footer
      id="contact"
      className="bg-footer-foreground text-primary-foreground pt-16"
    >
      <div className="container">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center space-x-2">
              <span className="text-xl font-semibold">Vision Wisdom</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Connecting skilled professionals with global opportunities. Our
              expertise ensures the perfect match for both talent and employers.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-bold">Job Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/jobs"
                    search={{ categories: [cat.slug] }}
                    className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-bold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="text-primary-foreground mr-3 h-5 w-5 shrink-0" />
                <span className="text-primary-foreground/80">
                  {site.streetAddress}
                </span>
              </li>
              <li className="flex">
                <Phone className="text-primary-foreground mr-3 h-5 w-5 shrink-0" />
                <span className="text-primary-foreground/80 flex gap-2">
                  <a
                    href="https://wa.me/9779764837077"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    +977-9764837077
                  </a>
                  <a
                    href="https://wa.me/9779761156827"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    +977-9761156827
                  </a>
                </span>
              </li>
              <li className="flex">
                <Mail className="text-primary-foreground mr-3 h-5 w-5 shrink-0" />
                <a
                  href={`mailto:${site.email}`}
                  className="text-primary-foreground/80"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-primary-foreground border-t border-white/10 py-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Vision Wisdom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
