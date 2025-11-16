import { z } from "zod";
import { ChevronRightIcon, NewspaperIcon, Search } from "lucide-react";

import { FormEvent, useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog-card";

import { cn } from "@/util/cn";
import { seo } from "@/util/seo";
import { api } from "@/orpc/client";
import { site } from "@/config/site";

export const Route = createFileRoute("/_main/blogs")({
  component: RouteComponent,
  validateSearch: z.object({
    categories: z.array(z.string()).optional().default([]).catch([]),
    page: z.number().int().min(1).optional().default(1).catch(1),
    pageSize: z.number().int().min(5).optional().default(12).catch(12),
    search: z.string().optional().default("").catch(""),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    await Promise.all([
      queryClient.ensureQueryData(
        api.blogs.all.queryOptions({
          input: { query: { ...search, status: ["published"] } },
        }),
      ),
      queryClient.ensureQueryData(
        api.blogs.categories.all.queryOptions({
          input: { query: { page: 1, pageSize: 100 } },
        }),
      ),
    ]);
  },
  head: () => ({
    meta: [
      ...seo({
        title: `Blogs | ${site.name}`,
        description:
          "Explore our collection of health and medical blogs, providing expert insights, wellness tips, and the latest updates in the healthcare field.",
        keywords: `health, medical blogs, wellness tips, healthcare, ${site.name}`,
      }),
      { name: "creator", content: site.name },
      { name: "publisher", content: site.name },
      { name: "robot", content: "index, follow" },
      { rel: "canonical", href: `${site.url}/blogs` },
    ],
  }),
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = Route.useNavigate();

  const {
    data: { blogs },
  } = useSuspenseQuery(
    api.blogs.all.queryOptions({
      input: { query: { ...searchParams, status: ["published"] } },
    }),
  );

  const {
    data: { categories },
  } = useSuspenseQuery(
    api.blogs.categories.all.queryOptions({
      input: { query: { page: 1, pageSize: 100 } },
    }),
  );

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, search: searchQuery }),
      resetScroll: false,
    });
  }

  useEffect(() => {
    setSearchQuery(searchParams.search || "");
  }, [searchParams.search]);

  return (
    <main>
      <section className="hero-gradient py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="bg-primary/10 mb-6 inline-flex items-center justify-center rounded-full p-2">
              <NewspaperIcon className="text-primary mr-2 h-5 w-5" />
              <span className="text-primary text-sm font-medium">Blogs</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
              <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent">
                Explore Our Latest Insights
              </span>
            </h1>

            <p className="text-foreground/80 mx-auto mb-8 max-w-2xl text-lg text-balance md:text-xl">
              Discover expert-written articles, news, and guides designed to
              keep you informed and inspired.
            </p>
          </div>
        </div>
      </section>
      <section className="container py-14 md:py-20 lg:py-28">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[4fr_2fr]">
          <div className="mb-8 overflow-y-auto">
            <div className="flex flex-wrap justify-start gap-2 bg-transparent p-0">
              <Link
                to="/blogs"
                search={{ categories: [] }}
                className={cn(
                  "bg-muted rounded-full border px-4 py-2 transition-all duration-300",
                  searchParams.categories.length === 0 &&
                    "text-primary-foreground bg-primary",
                )}
                resetScroll={false}
              >
                All
              </Link>
              {categories.map((cat) => {
                let values = [...searchParams.categories];
                if (searchParams.categories.includes(cat.slug)) {
                  values = searchParams.categories.filter(
                    (c) => c !== cat.slug,
                  );
                } else {
                  values.push(cat.slug);
                }

                return (
                  <Link
                    key={cat.id}
                    to="/blogs"
                    search={{ categories: values }}
                    className={cn(
                      "bg-muted rounded-full border px-4 py-2 transition-all duration-300",
                      searchParams.categories.includes(cat.slug) &&
                        "text-primary-foreground bg-primary",
                    )}
                    resetScroll={false}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full self-start"
          >
            <Input
              type="text"
              placeholder="Search blogs by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full px-6 py-6"
            />
            <Button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-r-full has-[>svg]:pr-4"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">
              {blogs.length} blog{blogs.length !== 1 ? "s" : ""} found
            </p>
            {searchParams.search && (
              <p className="text-muted-foreground text-sm">
                Results for &quot;{searchParams.search}&quot;
              </p>
            )}
          </div>
          {(searchParams.search || searchParams.categories.length > 0) && (
            <Button variant="ghost" asChild className="text-sm">
              <Link to="/blogs" resetScroll={false}>
                Clear all
              </Link>
            </Button>
          )}
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.truncatedContent}
                image={blog.coverPhoto?.url}
                date={blog.createdAt}
                author={blog.author?.name}
                slug={blog.slug}
                category={blog.categoryName}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Search className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No blogs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>

            <Button variant="outline" asChild>
              <Link to="/blogs" resetScroll={false}>
                Clear all
              </Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
