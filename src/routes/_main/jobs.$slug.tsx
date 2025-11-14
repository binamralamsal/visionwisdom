import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Users,
} from "lucide-react";

import { useEffect } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Card, CardContent } from "@/components/ui/card";

import { jobs } from "@/data/jobs";

export const Route = createFileRoute("/_main/jobs/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useParams();

  const job = jobs.find((job) => job.id === data.slug);

  // Tanstack Router's bug: https://github.com/TanStack/router/issues/3680#issuecomment-2704415487
  // useEffect(() => {
  //   window.scrollTo({ top: 0 });
  // }, []);

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="mx-auto mb-4 h-8 w-48 rounded bg-gray-200"></div>
          <div className="mx-auto h-4 w-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
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
                src={job.image}
                alt={job.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="bg-primary/90 mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                  {job.category}
                </div>
                <h1 className="text-2xl font-bold md:text-3xl">{job.title}</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3 md:p-8">
              <div className="col-span-2">
                <div className="mb-6">
                  <h2 className="mb-3 text-xl font-bold">Job Description</h2>
                  <p className="text-foreground/80 mb-4">{job.description}</p>

                  <h3 className="mt-6 mb-3 text-lg font-bold">Requirements</h3>
                  <ul className="space-y-2">
                    {[
                      "Minimum 3 years of experience in a similar role",
                      "Relevant qualifications or certification",
                      "Strong communication and teamwork skills",
                      "Ability to work in high-pressure environments",
                      "Available to relocate internationally",
                    ].map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-6 mb-3 text-lg font-bold">Benefits</h3>
                  <ul className="space-y-2">
                    {[
                      "Competitive salary package",
                      "Accommodation provided",
                      "Health insurance coverage",
                      "Transportation allowance",
                      "Paid annual leave",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
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
                            {job.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-foreground/70">
                            {job.country}
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
                          <div className="text-accent font-medium">
                            {job.salary}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Contract Length</div>
                          <div className="text-foreground/70">
                            2 years (renewable)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Working Hours</div>
                          <div className="text-foreground/70">
                            40 hours/week
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Briefcase className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Experience</div>
                          <div className="text-foreground/70">3+ years</div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FileText className="text-primary mt-1 mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">Documents Required</div>
                          <div className="text-foreground/70">
                            Resume, ID, Certificates
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
