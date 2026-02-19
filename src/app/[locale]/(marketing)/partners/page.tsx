import { Button } from "@/components/ui/button";
import {
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiGlobalLine,
  RiLineChartLine,
  RiTeamLine,
} from "@remixicon/react";
import Link from "next/link";
import Image from "next/image";

export default function PartnersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/IMG_9723.JPG" // Placeholder, ideally specific vendor image
            alt="Partner with Vizit Africa"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="container relative z-10 px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 animate-fade-in-up">
            Grow Your Business with{" "}
            <span className="text-primary">Vizit Africa</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
            Join our exclusive network of premium travel providers and reach
            high-value travelers looking for authentic African experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
            <Button
              size="lg"
              className="h-12 px-8 text-lg"
              render={<Link href="/partners/apply" />}
            >
              Become a Partner <RiArrowRightLine className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the tools and exposure you need to scale your tourism
              business.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <RiGlobalLine className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Reach</h3>
              <p className="text-muted-foreground">
                Access a worldwide audience of travelers specifically interested
                in premium African tourism.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <RiTeamLine className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Targeted Audience</h3>
              <p className="text-muted-foreground">
                Connect with travelers who value quality, sustainability, and
                authentic experiences.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <RiLineChartLine className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Business Growth</h3>
              <p className="text-muted-foreground">
                Utilize our powerful dashboard to manage bookings, track
                performance, and optimize your offerings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats Section (Placeholder for now) */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Designed for Tour Operators, Hotels, and Guides
              </h2>
              <ul className="space-y-4">
                {[
                  "Easy-to-use booking management system",
                  "Direct communication with clients",
                  "Automated invoicing and payments",
                  "Marketing support and featured listings",
                  "Analytics and performance insights",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <RiCheckboxCircleLine className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="mt-8"
                render={<Link href="/partners/apply" />}
              >
                Get Started Today
              </Button>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/gallery/IMG_9788.JPG"
                alt="Vendor Dashboard Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container relative z-10 px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Ready to Scale Your Business?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join thousands of other successful partners on Vizit Africa. Setup
            takes less than 5 minutes.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-14 px-10 text-lg"
            render={<Link href="/partners/apply" />}
          >
            Apply Now
          </Button>
        </div>
      </section>
    </div>
  );
}
