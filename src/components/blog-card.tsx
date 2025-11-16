import { BlogPosting, WithContext } from "schema-dts";
import { ArrowRight, Calendar, Share2, User } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { site } from "@/config/site";

export function BlogCard({
  title,
  excerpt,
  slug,
  image,
  date,
  author,
  category,
}: {
  title: string;
  excerpt: string;
  image?: string | null;
  slug: string;
  date: Date;
  author?: string | null;
  category: string | null;
}) {
  const blogJsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    url: `${site.url}/blogs/${slug}`,
    datePublished: date.toISOString(),
    author: author
      ? {
          "@type": "Person",
          name: author,
        }
      : undefined,
    image: image ? [`${site.url}${image}`] : undefined,
    articleSection: category || undefined,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logo.png`,
      },
    },
  };
  return (
    <div className="group dark:bg-muted/20 dark:hover:bg-muted/50 rounded-md border shadow-slate-100 transition-all duration-300 hover:shadow-lg dark:shadow-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="relative overflow-hidden">
        <Link to="/blogs/$slug" params={{ slug }}>
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {category && (
          <div className="bg-secondary/90 text-secondary-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-medium">
            {category}
          </div>
        )}
        <button className="text-primary bg-background absolute top-4 right-4 rounded-full p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Share2 size={16} />
        </button>
      </div>
      <div className="grid gap-3 p-6">
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {date.toLocaleDateString()}
          </div>
          {author && (
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              {author}
            </div>
          )}
        </div>
        <Link to="/blogs/$slug" params={{ slug }}>
          <h3 className="text-primary line-clamp-2 text-xl font-bold">
            {title}
          </h3>
        </Link>
        <p className="text-foreground/80 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        <Link
          to="/blogs/$slug"
          params={{ slug }}
          className="text-primary group/link flex items-center font-medium underline-offset-6 hover:underline"
        >
          Read more
          <ArrowRight
            size={16}
            className="ml-2 transition-transform group-hover/link:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
