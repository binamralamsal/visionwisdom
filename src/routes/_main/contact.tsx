import { PhoneIcon } from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <section className="hero-gradient py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="bg-primary/10 mb-6 inline-flex items-center justify-center rounded-full p-2">
              <PhoneIcon className="text-primary mr-2 h-5 w-5" />
              <span className="text-primary text-sm font-medium">
                Get In Touch
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
              <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent">
                We&quot;d Love To Hear From You
              </span>
            </h1>

            <p className="text-foreground/80 mx-auto mb-8 max-w-2xl text-lg text-balance md:text-xl">
              Whether you have questions about our services, need assistance, or
              want to explore job opportunities, our team is here to help.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
