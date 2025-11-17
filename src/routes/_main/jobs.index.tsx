import { z } from "zod";
import {
  ArrowRightIcon,
  BanknoteIcon,
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";

import { FormEvent, useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { cn } from "@/util/cn";
import { api } from "@/orpc/client";

export const Route = createFileRoute("/_main/jobs/")({
  component: RouteComponent,
  validateSearch: z.object({
    categories: z.array(z.string()).optional().default([]).catch([]),
    page: z.number().int().min(1).optional().default(1).catch(1),
    pageSize: z.number().int().min(5).optional().default(12).catch(12),
    search: z.string().optional().default("").catch(""),
    gender: z
      .array(z.enum(["any", "male", "female"]))
      .optional()
      .default([])
      .catch([]),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    await Promise.all([
      queryClient.ensureQueryData(
        api.jobs.all.queryOptions({
          input: { query: { ...search, status: ["published"] } },
        }),
      ),
      queryClient.ensureQueryData(
        api.jobs.categories.all.queryOptions({
          input: { query: { page: 1, pageSize: 100 } },
        }),
      ),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Jobs | YourSite" },
      {
        rel: "canonical",
        href: `${typeof window !== `undefined` ? window.location.origin : ``}/jobs`,
      },
    ],
  }),
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = Route.useNavigate();

  const {
    data: { jobs, pagination },
  } = useSuspenseQuery(
    api.jobs.all.queryOptions({
      input: { query: { ...searchParams, status: ["published"] } },
    }),
  );

  const {
    data: { categories },
  } = useSuspenseQuery(
    api.jobs.categories.all.queryOptions({
      input: { query: { page: 1, pageSize: 100 } },
    }),
  );

  useEffect(() => {
    setSearchQuery(searchParams.search || "");
  }, [searchParams.search]);

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, search: searchQuery, page: 1 }),
      resetScroll: false,
    });
  }

  function clearFilters() {
    navigate({
      to: ".",
      search: () => ({
        page: 1,
        pageSize: searchParams.pageSize || 12,
        categories: [],
        search: "",
      }),
      resetScroll: false,
    });
  }

  function toggleCategory(catSlug: string) {
    let values = [...(searchParams.categories || [])];
    if (values.includes(catSlug)) {
      values = values.filter((c) => c !== catSlug);
    } else {
      values.push(catSlug);
    }
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, categories: values, page: 1 }),
      resetScroll: false,
    });
  }

  return (
    <main>
      <section className="hero-gradient py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="bg-primary/10 mb-6 inline-flex items-center justify-center rounded-full p-2">
              <BriefcaseIcon className="text-primary mr-2 h-5 w-5" />
              <span className="text-primary text-sm font-medium">
                Available Opportunities
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
              <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent">
                Discover Your Next Career Move
              </span>
            </h1>

            <p className="text-foreground/80 mx-auto mb-8 max-w-2xl text-lg text-balance md:text-xl">
              Browse through our curated list of global opportunities and find
              the perfect position that matches your skills and aspirations.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12 lg:py-16">
        <div className="grid items-center gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  navigate({
                    to: ".",
                    search: (prev) => ({ ...prev, categories: [], page: 1 }),
                    resetScroll: false,
                  })
                }
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-all",
                  (searchParams.categories || []).length === 0
                    ? "bg-primary text-white"
                    : "bg-muted",
                )}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.slug)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    searchParams.categories?.includes(cat.slug)
                      ? "bg-primary text-white"
                      : "bg-muted",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="w-full max-w-xl">
                <InputGroup className="rounded-full py-6">
                  <InputGroupInput
                    type="search"
                    placeholder="Search jobs by title, company or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4"
                  />

                  <InputGroupAddon align="inline-end" className="pr-4">
                    <InputGroupButton asChild>
                      <Button
                        type="submit"
                        className="rounded-full px-4 py-4"
                        aria-label="Search"
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                      </Button>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-end gap-3 md:col-span-1">
            <div className="text-right">
              <p className="text-lg font-medium">
                {pagination.totalItems} job
                {pagination.totalItems !== 1 ? "s" : ""} found
              </p>
              {searchParams.search && (
                <p className="text-muted-foreground text-sm">
                  Results for &quot;{searchParams.search}&quot;
                </p>
              )}
            </div>

            {(searchParams.search ||
              (searchParams.categories &&
                searchParams.categories.length > 0)) && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                Clear all
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  id: job.id,
                  title: job.title,
                  slug: job.slug,
                  company: job.company ?? null,
                  location: job.location ?? null,
                  gender: job.gender,
                  salary: job.salary ?? null,
                  image: job.file?.url ?? undefined,
                  category: job.categoryName ?? "",
                }}
              />
            ))
          ) : (
            <div className="py-16 text-center md:col-span-2 lg:col-span-3">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <UsersIcon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            disabled={Number(searchParams.page || 1) <= 1}
            asChild
          >
            <Link
              to="."
              search={{
                ...searchParams,
                page: Math.max(1, Number(searchParams.page || 1) - 1),
              }}
            >
              Prev
            </Link>
          </Button>

          {renderPageButtons(
            Number(searchParams.page || 1),
            pagination.totalPages,
          ).map((p) => {
            const active = p === Number(searchParams.page || 1);

            return (
              <Button
                key={p}
                variant={active ? "default" : "ghost"}
                disabled={active}
                size="sm"
                asChild
              >
                <Link to="." search={{ ...searchParams, page: p }}>
                  {p}
                </Link>
              </Button>
            );
          })}

          <Button
            variant="ghost"
            disabled={Number(searchParams.page || 1) >= pagination.totalPages}
            asChild
          >
            <Link
              to="."
              search={{
                ...searchParams,
                page: Math.min(
                  pagination.totalPages,
                  Number(searchParams.page || 1) + 1,
                ),
              }}
            >
              Next
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

type JobCardProps = {
  job: {
    id: number;
    slug: string;
    title: string;
    company?: string | null;
    location?: string | null;
    gender: string;
    salary?: string | null;
    image?: string;
    category?: string;
  };
};

function JobCard({ job }: JobCardProps) {
  return (
    <Card className="glass-card overflow-hidden py-0 transition-shadow hover:shadow-lg">
      <div className="relative">
        <Link to="/jobs/$slug" params={{ slug: job.slug }}>
          <div className="bg-muted h-48 w-full overflow-hidden">
            {job.image ? (
              <img
                src={job.image}
                alt={job.title}
                className="h-48 w-full rounded-t-xl object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="text-muted-foreground flex h-48 w-full items-center justify-center">
                No image
              </div>
            )}
          </div>
        </Link>

        {job.category && (
          <div className="absolute top-3 left-3">
            <Badge className="capitalize">{job.category}</Badge>
          </div>
        )}
      </div>
      <CardContent>
        <Link to="/jobs/$slug" params={{ slug: job.slug }}>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
            {job.title}
          </h3>
        </Link>

        <div className="grid gap-2">
          <div className="text-foreground/80 flex items-center text-sm">
            <BuildingIcon className="text-primary/80 mr-2 h-4 w-4" />
            <span>{job.company ?? "—"}</span>
          </div>

          <div className="text-foreground/80 flex items-center text-sm">
            <MapPinIcon className="text-primary/80 mr-2 h-4 w-4" />
            <span>{job.location ?? "—"}</span>
          </div>

          <div className="text-foreground/80 flex items-center text-sm">
            <UsersIcon className="text-primary/80 mr-2 h-4 w-4" />
            <span className="capitalize">{job.gender}</span>
          </div>

          <div className="text-highlight flex items-center text-sm font-medium">
            <BanknoteIcon className="mr-2 h-4 w-4" />
            <span>{job.salary ?? "Negotiable"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" asChild size="lg">
          <Link to="/jobs/$slug" params={{ slug: job.slug }}>
            Apply Now <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

/* helpers */

function renderPageButtons(current: number, total: number) {
  const pages: number[] = [];
  const maxButtons = 7;
  const half = Math.floor(maxButtons / 2);

  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  if (end - start + 1 < maxButtons) {
    if (start === 1) {
      end = Math.min(total, start + maxButtons - 1);
    } else if (end === total) {
      start = Math.max(1, end - maxButtons + 1);
    }
  }

  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}
