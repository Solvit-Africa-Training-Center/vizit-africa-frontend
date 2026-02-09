"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { teamMembers } from "@/lib/dummy-data";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { RevealText } from "@/components/ui/reveal-text";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const values = [
  {
    order: "01",
    title: "Respect",
    description:
      "We honor the land, the wildlife, and the communities we visit. Every footprint we leave is mindful.",
  },
  {
    order: "02",
    title: "Authenticity",
    description:
      "We don't stage experiences. We facilitate genuine connections with the real people and culture of Rwanda.",
  },
  {
    order: "03",
    title: "Impact",
    description:
      "Tourism is a force for good. A portion of every journey goes directly to community upliftment.",
  },
  {
    order: "04",
    title: "Excellence",
    description:
      "From the vehicle you ride in to the coffee you drink, we obsess over every detail of your journey.",
  },
];

export default function AboutPage() {
  const teamContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: teamContainerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-32 pb-24">
        <header className="px-5 md:px-10 max-w-7xl mx-auto mb-32 md:mb-48">
          <div className="flex flex-col gap-8">
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground block">
              Established 2018
            </span>
            <h1 className="font-display text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] text-foreground">
              <RevealText text="The Vizit Story" />
            </h1>
          </div>
        </header>

        <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32 md:mb-48">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8 md:col-start-3">
              <p className="font-display text-3xl md:text-5xl font-bold leading-tight indent-12 md:indent-24">
                <span className="text-primary">We don't just visit.</span> We
                immerse. Vizit Africa was born from a simple yet radical belief:
                that travel should be more than sightseeing—it should be
                soul-stirring.
              </p>
              <p className="font-display text-3xl md:text-5xl font-bold leading-tight mt-12 text-muted-foreground/60">
                We strip away the artificial layers of tourism to reveal the
                raw, beating heart of Rwanda.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-32 md:mb-48 overflow-hidden">
          <div className="px-5 md:px-10 max-w-7xl mx-auto mb-12 flex items-end justify-between">
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase">
              The Guides
            </h2>
            <p className="text-muted-foreground max-w-xs text-right hidden md:block">
              Locals. Storytellers. Experts. <br /> Meet the people who know
              Rwanda best.
            </p>
          </div>

          <div ref={teamContainerRef} className="relative w-full">
            <motion.div
              style={{ x }}
              className="flex gap-8 px-5 md:px-10 w-max cursor-grab active:cursor-grabbing"
            >
              {teamMembers.map((member, i) => (
                <div
                  key={member.id}
                  className="relative w-[80vw] md:w-[25vw] aspect-[3/4] group shrink-0"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-sm bg-muted">
                    <ParallaxImage
                      src={
                        [
                          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=1000&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
                        ][i % 4]
                      }
                      alt={member.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      containerClassName="w-full h-[120%]"
                    />
                  </div>
                  <div className="absolute -bottom-8 left-0">
                    <h3 className="font-display text-4xl font-bold uppercase text-foreground">
                      {member.name}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
              <div className="w-[10vw] shrink-0" />
            </motion.div>
          </div>
        </section>

        <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {values.map((val) => (
              <div
                key={val.title}
                className="flex flex-col border-t border-foreground pt-6 group hover:border-primary transition-colors duration-500"
              >
                <span className="font-mono text-sm text-muted-foreground mb-4">
                  ({val.order})
                </span>
                <h3 className="font-display text-3xl font-bold mb-4 uppercase group-hover:text-primary transition-colors duration-300">
                  {val.title}
                </h3>
                <p className="text-muted-foreground/80 leading-relaxed text-sm">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-10 max-w-7xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tight mb-8">
            Start Your Journey
          </h2>
          <a href="/contact" className="inline-block relative group">
            <span className="font-mono text-lg uppercase tracking-widest text-foreground group-hover:text-primary transition-colors duration-300">
              Get in Touch
            </span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-foreground group-hover:bg-primary transition-colors duration-300 origin-left group-hover:scale-x-100" />
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
}
