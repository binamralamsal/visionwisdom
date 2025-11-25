import { toast } from "sonner";
import { BlogPosting, WithContext } from "schema-dts";
import { Calendar, ChevronRight, Share2Icon } from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { RenderTextEditorContent } from "@/components/render-text-editor-content";

import { seo } from "@/util/seo";
import { api } from "@/orpc/client";
import { site } from "@/config/site";

export const Route = createFileRoute("/_main/blogs_/$slug")({
  component: RouteComponent,
  loader: async ({ params: { slug }, context: { queryClient } }) => {
    try {
      const blogs = await queryClient.ensureQueryData(
        api.blogs.getBySlug.queryOptions({
          input: { params: { slug } },
        }),
      );

      return blogs;
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      ...seo({
        title: loaderData?.seoTitle || `${loaderData?.title} | ${site.name}`,
        description: loaderData?.seoDescription || loaderData?.truncatedContent,
        image: loaderData?.coverPhoto?.url || "/placeholder.svg",
        keywords:
          loaderData?.seoKeywords ||
          `${loaderData?.category?.name || ``}, health blog, medical tips, ${site.name}`,
      }),
      { name: "author", content: loaderData?.author?.name || site.name },
      { name: "robot", content: "index, follow" },
      { name: "canonical", content: "${site.url}/blogs/${loaderData?.slug}" },
    ],
  }),
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data: blog } = useSuspenseQuery(
    api.blogs.getBySlug.queryOptions({
      input: { params: { slug } },
    }),
  );

  if (!blog) return null;

  const blogJsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.truncatedContent,
    url: `${site.url}/blogs/${blog.slug}`,
    datePublished: blog.createdAt.toISOString(),
    author: blog.author
      ? {
          "@type": "Person",
          name: blog.author.name,
        }
      : undefined,
    image: blog.coverPhoto?.url
      ? {
          "@type": "ImageObject",
          url: `${site.url}${blog.coverPhoto.url}`,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logo.png`,
      },
    },
    articleSection: blog.category?.name || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "${site.url}/blogs/${blog.slug}",
    },
  };

  function handleShareButtonClick() {
    if (!blog) return;

    if (navigator.share) {
      navigator
        .share({
          title: `${blog.title} | ${site.name}`,
          text: `Checkout this wonderful article`,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 md:py-20 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <header className="mb-12">
        <nav className="text-muted-foreground mb-8 flex items-center gap-2 text-sm">
          <Link className="hover:text-primary transition-colors" to="/blogs">
            Blogs
          </Link>
          <ChevronRight className="h-4 w-4" />
          {blog.category && (
            <>
              <Link
                className="hover:text-primary cursor-pointer transition-colors"
                to="/blogs"
                search={{ categories: [blog.category.slug] }}
              >
                {blog.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground font-medium">{blog.title}</span>
        </nav>

        {blog.category && (
          <div className="mb-6">
            <Link
              className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
              to="/blogs"
              search={{ categories: [blog.category.slug] }}
            >
              {blog.category.name}
            </Link>
          </div>
        )}

        <h1 className="mb-8 text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-6xl">
          {blog.title}
        </h1>

        <div className="text-muted-foreground mb-8 flex flex-wrap items-center gap-4 text-sm">
          {blog.author && (
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-primary text-xs font-semibold">
                  {blog.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-foreground font-medium">
                {blog.author.name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{blog.createdAt.toLocaleDateString()}</span>
          </div>
          <Button
            variant="link"
            className="cursor-pointer hover:no-underline"
            size="sm"
            onClick={handleShareButtonClick}
          >
            <Share2Icon className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="bg-muted relative overflow-hidden rounded-lg">
          <img
            src={blog.coverPhoto?.url || "/placeholder.svg"}
            alt={blog.title}
            className="h-auto w-full object-cover"
          />
        </div>
      </header>

      <article className="prose prose-lg max-w-none">
        <RenderTextEditorContent html={blog.content} />
      </article>

      <div className="my-16">
        <div className="border-border border-t"></div>
      </div>

      <footer className="space-y-6">
        {blog.author && (
          <div className="border-border bg-muted/30 flex items-center gap-4 rounded-lg border p-6">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
              <span className="text-primary text-lg font-semibold">
                {blog.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-semibold">
                Written by {blog.author.name}
              </h3>
              <Link to="/blogs" className="text-muted-foreground mt-1 text-sm">
                Published on {blog.createdAt.toLocaleDateString()}
                {blog.category && (
                  <span>
                    {" "}
                    in{" "}
                    <Link
                      className="text-primary font-medium"
                      to="/blogs"
                      search={{ categories: [blog.category.slug] }}
                    >
                      {blog.category.name}
                    </Link>
                  </span>
                )}
              </Link>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareButtonClick}
            >
              <Share2Icon className="h-4 w-4" />
              Share
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>{blog.createdAt.toLocaleDateString()}</span>
            {blog.category && (
              <Link
                to="/blogs"
                search={{ categories: [blog.category.slug] }}
                className="text-primary font-medium"
              >
                {blog.category.name}
              </Link>
            )}
          </div>
          <Link
            to="/blogs"
            className="text-primary hover:text-primary/80 flex gap-2 text-sm font-medium transition-colors"
          >
            <span>←</span> Back to all blogs
          </Link>
        </div>
      </footer>
    </div>
  );
}
