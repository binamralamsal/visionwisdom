import { toast } from "sonner";
import { ArrowLeftIcon, ChevronRightIcon, Share2Icon } from "lucide-react";
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Users,
} from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { seo } from "@/util/seo";
import { api } from "@/orpc/client";
import { site } from "@/config/site";

export const Route = createFileRoute("/_main/jobs/$slug")({
  component: RouteComponent,
  loader: async ({ params: { slug }, context: { queryClient } }) => {
    try {
      const job = await queryClient.ensureQueryData(
        api.jobs.getBySlug.queryOptions({
          input: { params: { slug } },
        }),
      );

      return job;
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      ...seo({
        title: loaderData?.title
          ? `${loaderData.title} | ${site.name}`
          : `Job | ${site.name}`,
        description:
          loaderData?.truncatedDescription ||
          `Apply for ${loaderData?.title} at ${loaderData?.company || site.name}`,
        image: loaderData?.file?.url || "/placeholder.svg",
        keywords: loaderData?.category?.name
          ? `${loaderData.category.name}, jobs, careers, ${site.name}`
          : `jobs, careers, ${site.name}`,
      }),
      { name: "creator", content: site.name },
      { name: "publisher", content: site.name },
      { name: "robot", content: "index, follow" },
      { rel: "canonical", href: `${site.url}/jobs/${loaderData?.slug}` },
    ],
  }),
});

function RouteComponent() {
  const { slug } = Route.useParams();

  const { data: job } = useSuspenseQuery(
    api.jobs.getBySlug.queryOptions({
      input: { params: { slug } },
    }),
  );

  function handleShareButtonClick() {
    if (navigator.share) {
      navigator
        .share({
          title: `${job.title} | ${site.name}`,
          text: `Check out this job: ${job.title} at ${job.company || site.name}`,
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
    <main>
      <div className="bg-secondary py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link
              to="/jobs"
              className="text-primary flex items-center gap-2 underline-offset-4 hover:underline"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Jobs
            </Link>
            <ChevronRightIcon className="text-muted-foreground mx-2 h-4 w-4" />
            <span className="text-muted-foreground">{job.title}</span>
          </div>
        </div>
      </div>

      <div className="bg-secondary pb-10">
        <div className="container">
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="relative h-56 overflow-hidden md:h-64">
              <img
                src={job.file?.url || "/placeholder.svg"}
                alt={job.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                {job.category?.name && (
                  <div className="bg-primary/90 mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                    {job.category.name}
                  </div>
                )}
                <h1 className="text-2xl font-bold md:text-3xl">{job.title}</h1>
                {job.company && (
                  <div className="mt-1 text-sm">{job.company}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3 md:p-8">
              <div className="col-span-2">
                <div className="mb-6">
                  <article
                    className="prose prose-li:my-1 prose-li:leading-snug prose-ul:my-2 prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareButtonClick}
                    >
                      <Share2Icon className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-lg font-bold">Job Details</h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Building className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Company</div>
                          <div className="text-foreground/70">
                            {job.company || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-foreground/70">
                            {job.location || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Users className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Gender</div>
                          <div className="text-foreground/70">{job.gender}</div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <DollarSign className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Salary</div>
                          <div className="text-highlight font-medium">
                            {job.salary || "Negotiable"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Contract Length</div>
                          <div className="text-foreground/70">
                            {job.contractLength || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Working Hours</div>
                          <div className="text-foreground/70">
                            {job.workingHours || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Briefcase className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Experience</div>
                          <div className="text-foreground/70">
                            {job.experience || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FileText className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Documents Required</div>
                          <div className="text-foreground/70">
                            {job.documentsRequired || "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
