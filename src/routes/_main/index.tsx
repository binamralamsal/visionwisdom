import { ArrowRightIcon } from "lucide-react";

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

  return (
    <main>
      <section className="hero-gradient flex items-center pt-20 pb-16">
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

              <p className="appear-animate max-w-[50ch] leading-relaxed text-balance delay-200">
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
    </main>
  );
}
