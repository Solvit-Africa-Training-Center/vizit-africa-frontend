import { Navbar } from "@/components/shared";
import { teamMembers } from "@/lib/dummy-data";
import {
  RiShieldCheckLine,
  RiHeart3Line,
  RiMapPin2Line,
  RiStarLine,
} from "@remixicon/react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-50 pt-20">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-primary/90 z-10" />
          <div className="absolute inset-0 z-0">
            {/* Placeholder for hero image - using a color fallback for now */}
            <div className="w-full h-full bg-primary-dark" />
          </div>

          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Our Story
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Founded in 2018, Vizit Africa was born from a passion for sharing
              Rwanda's breathtaking beauty and resilience with the world. We
              believe in travel that connects, inspires, and transforms.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 px-5 md:px-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Our Mission & Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are dedicated to providing authentic, seamless, and
              unforgettable travel experiences while supporting local
              communities and conservation efforts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm text-center">
              <div className="size-16 rounded-full bg-primary-subtle text-primary flex items-center justify-center mx-auto mb-6">
                <RiShieldCheckLine className="size-8" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">
                Trust & Safety
              </h3>
              <p className="text-muted-foreground">
                Your safety is our priority. We partner with verified operators
                and provide 24/7 support throughout your journey.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border shadow-sm text-center">
              <div className="size-16 rounded-full bg-accent-warm/10 text-accent-warm flex items-center justify-center mx-auto mb-6">
                <RiHeart3Line className="size-8" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">
                Local Impact
              </h3>
              <p className="text-muted-foreground">
                We believe in tourism that gives back. A portion of every
                booking supports local conservation and community projects.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border shadow-sm text-center">
              <div className="size-16 rounded-full bg-accent-success/10 text-accent-success flex items-center justify-center mx-auto mb-6">
                <RiMapPin2Line className="size-8" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">
                Authentic Experiences
              </h3>
              <p className="text-muted-foreground">
                Go beyond the guidebooks. Our local experts connect you with the
                real people, culture, and hidden gems of Rwanda.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-white py-20 border-t border-border">
          <div className="px-5 md:px-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Meet the Team
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  The passionate experts working behind the scenes to make your
                  dream trip a reality. We are locals, travelers, and planners
                  at heart.
                </p>
              </div>
              <div className="flex items-center gap-2 text-primary font-medium bg-primary-subtle px-4 py-2 rounded-full">
                <RiStarLine className="size-5 fill-current" />
                <span>40+ Years Combined Experience</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-muted">
                    {/* Placeholder for team image */}
                    <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                      Looking for {member.image}
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-5 md:px-10 bg-primary text-primary-foreground text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Ready to meet us in Kigali?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Let's plan a trip that exceeds your expectations.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-14 px-8 rounded-lg bg-white text-primary font-bold text-lg hover:bg-neutral-100 transition-colors"
            >
              Start Planning
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
