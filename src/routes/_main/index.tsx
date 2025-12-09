import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  DollarSignIcon,
  GlobeIcon,
  ShieldIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { seo } from "@/util/seo";
import { site } from "@/config/site";

export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      ...seo({
        title: `Home | ${site.name}`,
        description: site.description,
        keywords: site.keywords,
      }),
    ],
  }),
});

function RouteComponent() {
  const stats = [
    {
      icon: <CheckIcon className="text-highlight h-6 w-6" />,
      value: "100%",
      label: "Efficient & Safe",
    },
    {
      icon: <StarIcon className="text-highlight h-6 w-6" />,
      value: "9/10",
      label: "Client Satisfaction",
    },
    {
      icon: <UsersIcon className="text-highlight h-6 w-6" />,
      value: "5000+",
      label: "Successful Placements",
    },
    {
      icon: <ClockIcon className="text-highlight h-6 w-6" />,
      value: "10+ Years",
      label: "Industry Experience",
    },
  ];

  const features = [
    {
      icon: <GlobeIcon className="h-5 w-5" />,
      title: "Global Opportunities",
      description:
        "Work in countries across Asia, Europe, Middle East, and North America.",
    },
    {
      icon: <ShieldIcon className="h-5 w-5" />,
      title: "Safe & Secure",
      description:
        "All jobs vetted for legitimacy and compliance with labor laws.",
    },
    {
      icon: <DollarSignIcon className="h-5 w-5" />,
      title: "Competitive Salaries",
      description:
        "Earn above-market rates with comprehensive benefits packages.",
    },
    {
      icon: <ClockIcon className="h-5 w-5" />,
      title: "Fast Processing",
      description: "Swift application process with minimal wait times.",
    },
  ];

  const jobs = [
    {
      title: "Construction Workers",
      location: "Qatar",
      salary: "$1,500 - $2,200/month",
      category: "Construction",
    },
    {
      title: "Registered Nurses",
      location: "United Kingdom",
      salary: "$3,500 - $4,500/month",
      category: "Healthcare",
    },
    {
      title: "IT Specialists",
      location: "Singapore",
      salary: "$4,000 - $6,000/month",
      category: "Technology",
    },
  ];

  return (
    <main>
      <section className="hero-gradient flex items-center py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="grid gap-6">
              <div>
                <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-sm font-medium">
                  Your Confidence, Our Foundation
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-7xl">
                <span className="block">
                  <span className="text-primary">Wisdom</span> in Staffing,{" "}
                </span>
                <span className="text-primary">Vision</span> in Results
              </h1>

              <p className="max-w-[50ch] text-lg leading-relaxed text-balance">
                We&apos;re the trusted choice for manpower needs, connecting top
                talent with the right opportunities.
              </p>

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/apply">
                    Apply for Jobs
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn more</Link>
                </Button>
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="bg-primary/10 absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[400px] md:w-[400px]"></div>
                <img
                  src="/hero.jpg"
                  alt="Professional team discussing"
                  className="relative z-10 mx-auto w-full max-w-md rounded-2xl object-cover shadow-2xl lg:max-w-lg"
                />
                <div className="glass-card absolute -bottom-5 left-0 z-20 max-w-[200px] p-4 md:bottom-10 md:-left-10">
                  <div className="bg-highlight/10 mb-2 inline-flex items-center justify-center rounded-full p-2">
                    <span className="text-highlight font-bold">100%</span>
                  </div>
                  <p className="text-sm font-medium">
                    Efficient, Safe and Reliable Service
                  </p>
                </div>
                <div className="glass-card absolute -top-5 right-0 z-20 max-w-[200px] p-4 md:top-10 md:-right-10 lg:-right-5 xl:right-0">
                  <div className="bg-primary/10 mb-2 inline-flex items-center justify-center rounded-full p-2">
                    <span className="text-primary font-bold">9/10</span>
                  </div>
                  <p className="text-sm font-medium">
                    Clients reported positive reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
              About Us
            </span>
            <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
              Building Futures, One Opportunity at a Time
            </h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
              We provide top-tier staffing solutions, connecting skilled
              professionals with businesses across industries through expert
              recruitment, training, and deployment.
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center"
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="bg-highlight/10 flex h-14 w-14 items-center justify-center rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="mb-1 text-2xl font-bold">{stat.value}</h3>
                <p className="text-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <img
                  src="/about-home.jpg"
                  alt="Team meeting"
                  className="w-full rounded-2xl object-cover shadow-lg"
                />
                <div className="glass-card absolute top-4 right-4 z-20 max-w-60 p-4">
                  <h3 className="mb-1 font-bold">
                    People Love To Work With us
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Our candidates and clients rate us 4.9/5 on average
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-6 lg:w-1/2">
              <h3 className="text-2xl font-bold">Why Choose Vision Wisdom?</h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <CheckIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">Industry Expertise</h4>
                    <p className="text-foreground/70">
                      With deep industry knowledge, we match the right talent to
                      your specific needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <CheckIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">Comprehensive Vetting</h4>
                    <p className="text-foreground/70">
                      Our rigorous selection process ensures only qualified
                      professionals join our network.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <CheckIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">Global Opportunities</h4>
                    <p className="text-foreground/70">
                      We connect talent with opportunities across international
                      borders.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <CheckIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">Ongoing Support</h4>
                    <p className="text-foreground/70">
                      We provide continuous assistance to both clients and
                      candidates throughout the process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="mb-16 grid place-items-center text-center">
            <span className="bg-primary/10 text-primary mb-4 rounded-full px-3 py-1 text-sm font-medium">
              Global Opportunities
            </span>
            <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
              Wide Range of Jobs Overseas
            </h2>
            <p className="text-foreground/80 max-w-3xl text-lg text-balance">
              We provide safe, lucrative job opportunities across multiple
              countries. Join us for global career prospects with security and
              competitive salaries.
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-sm"
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-foreground/70 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h3 className="mb-6 text-center text-xl font-bold text-balance md:text-2xl">
              Featured Job Opportunities
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="glass-card p-6 transition-all hover:shadow-md"
                >
                  <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-2 py-1 text-xs font-medium">
                    {job.category}
                  </span>
                  <h4 className="mb-1 text-lg font-bold">{job.title}</h4>
                  <p className="text-foreground/70 mb-3 flex items-center text-sm">
                    <GlobeIcon className="mr-1 inline h-4 w-4" /> {job.location}
                  </p>
                  <p className="text-highlight mb-4 font-medium">
                    {job.salary}
                  </p>
                  <a
                    href="#"
                    className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium transition-colors"
                  >
                    View Details
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link to="/jobs">
                View more
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground w-full py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="grid place-items-center gap-4 text-center">
            <div className="space-y-2">
              <h2 className="max-w-[25ch] text-3xl leading-tight font-bold tracking-tighter text-balance sm:text-4xl md:text-5xl">
                Ready to Start Your Global Career Journey?
              </h2>
              <p className="mx-auto max-w-[40ch] text-balance md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Join thousands of satisfied candidates who have transformed
                their careers with Vision Wisdom.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
