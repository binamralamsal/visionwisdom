import {
  ArrowRight,
  AwardIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  GlobeIcon,
  HandHeartIcon,
  HeartIcon,
  ShieldIcon,
  TargetIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCounter } from "@/components/stats-counter";

export const Route = createFileRoute("/_main/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <section className="bg-muted relative overflow-hidden">
        <div className="relative z-10 container space-y-8 py-14 md:space-y-10 md:py-20 lg:space-y-12 lg:py-28">
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="grid gap-6">
              <div className="bg-primary/10 text-primary inline-block justify-self-start rounded-full px-4 py-1 text-sm font-semibold">
                About VisionWisdom
              </div>
              <h1 className="text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
                <span className="text-primary inline-block">
                  Connecting Nepal
                </span>{" "}
                <span className="text-highlight inline-block">
                  to the World
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-balance">
                Your trusted partner for international employment opportunities,
                helping Nepali professionals achieve their global career dreams
                since 2010.
              </p>
              <div className="mt-2 flex flex-col flex-wrap gap-2 md:flex-row">
                <Button className="group" size="lg" asChild>
                  <Link to="/jobs">
                    Browse Jobs{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#team">
                    <UsersIcon size={18} /> Meet Our Team
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="transform overflow-hidden rounded-lg shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src="/modern-medical-facility-exterior-with-glass-window.png"
                  alt="VisionWisdom office building"
                  className="h-auto w-full rounded-lg object-cover"
                />
                <div className="from-primary/30 absolute inset-0 bg-gradient-to-t to-transparent"></div>
              </div>
              <div className="animate-float bg-background/90 absolute right-4 bottom-4 max-w-xs rounded-lg p-4 shadow-lg backdrop-blur-md lg:-right-8 lg:bottom-14">
                <div className="flex items-center gap-3">
                  <div className="bg-highlight flex h-8 w-8 items-center justify-center rounded-full">
                    <AwardIcon className="text-highlight-foreground h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-highlight font-semibold">
                      Trusted Leader
                    </p>
                    <p className="text-muted-foreground text-sm">
                      International Placement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-secondary/10 absolute -top-72 -right-72 h-[800px] w-[800px] rounded-full blur-3xl"></div>
          <div className="bg-primary/10 absolute -bottom-72 -left-72 h-[600px] w-[600px] rounded-full blur-3xl"></div>
        </div>
      </section>

      <section id="our-story" className="container py-14 md:py-20 lg:py-28">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-sm font-medium">
              Our Journey
            </span>
            <h2 className="text-3xl font-bold text-balance md:text-4xl">
              Over a Decade of Bridging Opportunities
            </h2>
            <div className="text-foreground/80 space-y-4 leading-relaxed text-balance">
              <p>
                Founded in 2010, VisionWisdom began with a simple yet powerful
                mission: to help talented Nepali professionals access global
                employment opportunities. What started as a small recruitment
                agency in Kathmandu has grown into
                <strong className="text-foreground">
                  {" "}
                  Nepal's leading international job placement consultancy
                </strong>
                , connecting thousands of skilled workers with employers
                worldwide.
              </p>
              <p>
                Our transformation reflects our unwavering commitment to ethical
                recruitment practices, transparent processes, and genuine care
                for every candidate's career journey. We've built partnerships
                with reputable employers across the Middle East, Europe, Asia,
                and beyond, ensuring our candidates access legitimate
                opportunities with fair working conditions.
              </p>
              <p>
                Today, we stand as a beacon of hope for Nepali professionals
                seeking international careers, combining industry expertise with
                personalized guidance, comprehensive support services, and a
                track record that speaks for itself.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-highlight h-5 w-5 flex-shrink-0" />
                <p className="text-foreground/80">
                  Established in 2010 with a vision for global opportunities
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-highlight h-5 w-5 flex-shrink-0" />
                <p className="text-foreground/80">
                  Licensed by Nepal Government for overseas recruitment
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-highlight h-5 w-5 flex-shrink-0" />
                <p className="text-foreground/80">
                  Partnerships with 100+ international employers
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-highlight h-5 w-5 flex-shrink-0" />
                <p className="text-foreground/80">
                  Successfully placed thousands of candidates abroad
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-lg shadow-xl">
              <img
                src="/about-doctors.png"
                alt="VisionWisdom team collaboration"
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="animate-float bg-primary/90 text-primary-foreground absolute top-4 left-4 rounded-lg p-4 shadow-lg backdrop-blur-md lg:-top-6 lg:-left-6">
              <div className="text-2xl font-bold">2010</div>
              <div className="text-sm opacity-90">Founded</div>
            </div>
            <div className="animate-float bg-secondary/90 text-secondary-foreground absolute right-4 bottom-4 rounded-lg p-4 shadow-lg backdrop-blur-md lg:-right-6 lg:-bottom-6">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm opacity-90">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
              Our Foundation
            </span>
            <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
              Mission, Vision & Values
            </h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
              The principles that guide every placement we make and every
              candidate we serve.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                  <TargetIcon className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower Nepali professionals with genuine international
                  employment opportunities through ethical recruitment
                  practices, transparent processes, and comprehensive support
                  throughout their career journey abroad.
                </p>
              </CardContent>
            </Card>
            <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-highlight/10 group-hover:bg-highlight/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                  <EyeIcon className="text-highlight h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be Nepal's most trusted and preferred international job
                  placement consultancy, recognized for integrity, candidate
                  success, and setting the highest standards in overseas
                  recruitment services.
                </p>
              </CardContent>
            </Card>
            <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 transition-colors group-hover:bg-rose-100 dark:bg-rose-500/20 dark:group-hover:bg-rose-500/30">
                  <HandHeartIcon className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Integrity, transparency, candidate welfare, and ethical
                  practices guide everything we do. We treat every job seeker
                  with respect and ensure their rights and dignity are protected
                  throughout the process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-primary dark:bg-muted py-14 text-white">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Impact in Numbers</h2>
            <p className="text-primary-foreground/80 text-lg">
              Over 15 years of connecting Nepali talent with global
              opportunities
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <StatsCounter
              number={12000}
              label="Candidates Placed"
              icon="users"
            />
            <StatsCounter
              number={25}
              label="Destination Countries"
              icon="globe"
            />
            <StatsCounter
              number={100}
              label="Partner Companies"
              icon="building"
            />
            <StatsCounter
              number={15}
              label="Years of Excellence"
              icon="calendar"
            />
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20 lg:py-28">
        <div className="mb-16 text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
            Why Choose Us
          </span>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
            What Sets Us Apart
          </h2>
          <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
            Discover the unique advantages that make VisionWisdom your trusted
            partner for international employment.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-blue-50 p-3 dark:bg-blue-500/20">
              <ShieldIcon className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Licensed & Legal</h3>
            <p className="text-muted-foreground">
              Fully licensed by the Government of Nepal with all necessary
              certifications for overseas employment services, ensuring complete
              legal compliance and candidate protection.
            </p>
          </div>
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-green-50 p-3 dark:bg-green-500/20">
              <UserCheckIcon className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Verified Employers</h3>
            <p className="text-muted-foreground">
              All partner companies are thoroughly vetted to ensure legitimate
              opportunities, fair contracts, and proper working conditions for
              our candidates.
            </p>
          </div>
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-purple-50 p-3 dark:bg-purple-500/20">
              <BriefcaseIcon className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold">Diverse Opportunities</h3>
            <p className="text-muted-foreground">
              Access jobs across multiple sectors including healthcare,
              hospitality, construction, IT, security, and more in 25+ countries
              worldwide.
            </p>
          </div>
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-orange-50 p-3 dark:bg-orange-500/20">
              <HeartIcon className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Candidate-First Approach</h3>
            <p className="text-muted-foreground">
              We prioritize candidate welfare with pre-departure orientation,
              ongoing support, and assistance throughout the entire employment
              lifecycle.
            </p>
          </div>
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-teal-50 p-3 dark:bg-teal-500/20">
              <ClockIcon className="h-6 w-6 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold">Fast Processing</h3>
            <p className="text-muted-foreground">
              Streamlined documentation and visa processing with experienced
              staff who ensure your application moves efficiently through all
              required stages.
            </p>
          </div>
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-indigo-50 p-3 dark:bg-indigo-500/20">
              <GlobeIcon className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold">Global Network</h3>
            <p className="text-muted-foreground">
              Strong partnerships with reputable employers worldwide and support
              networks in destination countries to help you settle and succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 md:py-20 lg:py-28" id="team">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
              Leadership
            </span>
            <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
              Meet Our Leadership Team
            </h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
              Experienced recruitment professionals dedicated to ethical
              placement and candidate success.
            </p>
          </div>
          <div className="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group overflow-hidden border-0 pt-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img
                  src="/doctor-1.png"
                  alt="Managing Director"
                  className="h-64 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <CardContent>
                <h3 className="mb-2 text-xl font-bold">Ramesh Shrestha</h3>
                <p className="text-primary mb-3 font-medium">
                  Managing Director & Founder
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  With over 20 years of experience in international recruitment,
                  Ramesh founded VisionWisdom to create ethical pathways for
                  Nepali professionals to achieve global career success.
                </p>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden border-0 pt-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img
                  src="/doctor-1.png"
                  alt="Operations Director"
                  className="h-64 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <CardContent>
                <h3 className="mb-2 text-xl font-bold">Sita Karki</h3>
                <p className="text-primary mb-3 font-medium">
                  Director of Operations
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sita oversees all recruitment operations, ensuring smooth
                  processing, candidate support, and maintaining strong
                  relationships with international partners across all
                  destination countries.
                </p>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden border-0 pt-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img
                  src="/doctor-1.png"
                  alt="Client Relations Head"
                  className="h-64 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <CardContent>
                <h3 className="mb-2 text-xl font-bold">Prakash Thapa</h3>
                <p className="text-primary mb-3 font-medium">
                  Head of Client Relations
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Prakash manages relationships with employer partners
                  worldwide, ensuring quality job opportunities and fair
                  employment terms for all VisionWisdom candidates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
