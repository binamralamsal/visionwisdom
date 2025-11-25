import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { site } from "@/config/site";
import { ContactForm } from "@/features/contact-entries/components/contact-form";

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

      <section className="container grid gap-8 py-16 md:grid-cols-2 md:gap-12 md:py-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Let&apos;s Start a Conversation
          </h2>
          <p className="text-muted-foreground text-lg">
            Fill out the form and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="bg-primary/10 flex h-full flex-col justify-center gap-4 rounded-md border p-6 shadow-sm lg:p-8">
              <MapPinIcon className="text-primary" />
              <h3 className="text-lg font-bold">Office Address</h3>
              <div>
                {site.addressLocality} - {site.streetAddress}
              </div>
            </div>
            <div className="bg-primary/10 flex h-full flex-col justify-center gap-4 rounded-md border p-6 shadow-sm lg:p-8">
              <PhoneIcon className="text-primary" />
              <h3 className="text-lg font-bold">Call us</h3>
              <div>
                Let&apos;s work together towards a common goal - get in touch!
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://wa.me/9779764837077"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  +977-9764837077
                </a>
                <a
                  href="https://wa.me/9779761156827"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  +977-9761156827
                </a>

                {/* </Link>
                      </Button> */}
              </div>
            </div>
            <div className="bg-primary/10 flex h-full flex-col justify-center gap-4 rounded-md border p-6 shadow-sm lg:col-span-2 lg:p-8">
              <MailIcon className="text-primary" />
              <h3 className="text-lg font-bold">Email us</h3>
              <div>
                We&apos;re on top of things and aim to respond to all inquiries
                within 24 hours.
              </div>
              <Button variant="link" className="inline-block p-0" asChild>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-card self-center rounded-xl border p-6 shadow-sm md:p-8">
          <ContactForm />
        </div>
      </section>

      <section className="w-full" id="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7342163520803!2d85.32926089999999!3d27.681586799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900062f74e9%3A0x6e119585561e39d!2sVision%20wisdom%20recruitment!5e0!3m2!1sen!2snp!4v1732560000000!5m2!1sen!2snp"
          className="h-[400px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Vision Wisdom Recruitment Location"
        />
      </section>
    </div>
  );
}
