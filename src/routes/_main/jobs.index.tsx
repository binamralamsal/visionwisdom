import {
  ArrowRightIcon,
  BanknoteIcon,
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";

import { useState } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Job, jobs } from "@/data/jobs";

export const Route = createFileRoute("/_main/jobs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [filter, setFilter] = useState("all");

  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter(
          (job) => job.category.toLowerCase() === filter.toLowerCase(),
        );

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

      <section className="pb-14 md:pb-20 lg:pb-28">
        <div className="container">
          <div className="mb-5">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${filter === "all" ? "bg-primary text-white" : "bg-secondary hover:bg-secondary/80"}`}
              >
                All Jobs
              </button>
              {[
                "Healthcare",
                "Construction",
                "Technology",
                "Hospitality",
                "Engineering",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${filter === category ? "bg-primary text-white" : "bg-secondary hover:bg-secondary/80"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="glass-card overflow-hidden hover:shadow-md">
      <div className="relative">
        <Link to="/jobs/$slug" params={{ slug: job.id }}>
          <img
            src={job.image}
            alt={job.title}
            className="h-60 w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="absolute top-0 right-0 m-3">
          <span className="bg-primary/90 inline-block rounded-full px-3 py-1 text-xs font-medium text-white">
            {job.category}
          </span>
        </div>
      </div>

      <CardContent>
        <Link to="/jobs/$slug" params={{ slug: job.id }}>
          <h3 className="mb-4 line-clamp-2 text-xl font-bold">{job.title}</h3>
        </Link>

        <div className="grid gap-2">
          <div className="text-foreground/70 flex items-center text-sm">
            <BuildingIcon className="text-primary/70 mr-2 h-4 w-4" />
            <span>{job.company}</span>
          </div>

          <div className="text-foreground/70 flex items-center text-sm">
            <MapPinIcon className="text-primary/70 mr-2 h-4 w-4" />
            <span>{job.country}</span>
          </div>

          <div className="text-foreground/70 flex items-center text-sm">
            <UsersIcon className="text-primary/70 mr-2 h-4 w-4" />
            <span>{job.gender}</span>
          </div>

          <div className="text-accent flex items-center text-sm font-medium">
            <BanknoteIcon className="mr-2 h-4 w-4" />
            <span>{job.salary}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pb-6">
        <Button className="w-full" variant="default" size="lg" asChild>
          <Link to="/jobs/$slug" params={{ slug: job.id }}>
            Apply Now
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
