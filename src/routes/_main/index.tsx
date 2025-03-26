import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { useEffect, useRef } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_main/")({
  component: Home,
});

function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, options);

    const elements = document.querySelectorAll(".appear-animate");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const stats = [
    {
      icon: <CheckIcon className="text-accent h-6 w-6" />,
      value: "100%",
      label: "Efficient & Safe",
    },
    {
      icon: <StarIcon className="text-accent h-6 w-6" />,
      value: "9/10",
      label: "Client Satisfaction",
    },
    {
      icon: <UsersIcon className="text-accent h-6 w-6" />,
      value: "5000+",
      label: "Successful Placements",
    },
    {
      icon: <ClockIcon className="text-accent h-6 w-6" />,
      value: "10+ Years",
      label: "Industry Experience",
    },
  ];

  return (
    <main>
      <section className="hero-gradient flex items-center py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="grid gap-6">
              <div className="appear-animate delay-100">
                <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-sm font-medium">
                  Your Confidence, Our Foundation
                </span>
              </div>

              <h1 className="appear-animate text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-7xl">
                <span className="block">
                  <span className="text-primary">Wisdom</span> in Staffing,{" "}
                </span>
                <span className="text-primary">Vision</span> in Results
              </h1>

              <p className="appear-animate max-w-[50ch] text-lg leading-relaxed text-balance delay-200">
                We&auot;re the trusted choice for manpower needs, connecting top
                talent with the right opportunities.
              </p>

              <div className="appear-animate flex flex-col gap-2 pt-2 delay-300 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/jobs">
                    View Jobs
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn more</Link>
                </Button>
              </div>
            </div>

            <div className="appear-animate delay-400">
              <div className="relative">
                <div className="bg-primary/10 absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[400px] md:w-[400px]"></div>
                <img
                  src="/hero.jpg"
                  alt="Professional team discussing"
                  className="relative z-10 mx-auto w-full max-w-md rounded-2xl object-cover shadow-2xl lg:max-w-lg"
                />
                <div className="glass-card absolute -bottom-5 left-0 z-20 max-w-[200px] p-4 md:bottom-10 md:-left-10">
                  <div className="bg-accent/10 mb-2 inline-flex items-center justify-center rounded-full p-2">
                    <span className="text-accent font-bold">100%</span>
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
            <span className="bg-primary/10 text-primary appear-animate mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
              About Us
            </span>
            <h2 className="font-display appear-animate mb-6 text-3xl font-bold text-balance delay-100 md:text-4xl">
              Building Futures, One Opportunity at a Time
            </h2>
            <p className="text-foreground/80 appear-animate mx-auto max-w-3xl text-lg text-balance delay-200">
              We provide top-tier staffing solutions, connecting skilled
              professionals with businesses across industries through expert
              recruitment, training, and deployment.
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card appear-animate p-6 text-center"
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="bg-accent/10 flex h-14 w-14 items-center justify-center rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="mb-1 text-2xl font-bold">{stat.value}</h3>
                <p className="text-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="appear-animate w-full delay-300 lg:w-1/2">
              <div className="relative">
                <img
                  src="/about-home.jpg"
                  alt="Team meeting"
                  className="w-full rounded-2xl object-cover shadow-lg"
                />
                <div className="glass-card absolute top-4 right-4 z-20 max-w-[240px] p-4">
                  <h3 className="mb-1 font-bold">
                    People Love To Work With us
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Our candidates and clients rate us 4.9/5 on average
                  </p>
                </div>
              </div>
            </div>

            <div className="appear-animate w-full space-y-6 delay-400 lg:w-1/2">
              <h3 className="font-display text-2xl font-bold">
                Why Choose Vision Wisdom?
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
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
                  <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
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
                  <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
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
                  <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
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
    </main>
  );
}
