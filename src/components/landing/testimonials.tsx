"use client";

import { SectionTitle } from "./section-title";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

const testimonials: TestimonialData[] = [
  {
    id: "t-1",
    name: "Sarah Mitchell",
    role: "Adventure Traveler",
    country: "United Kingdom",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    content:
      "Vizit Africa made our gorilla trekking dream come true. The logistics were flawless, and our guide Jean-Pierre was incredibly knowledgeable. Highly recommended!",
    rating: 5,
  },
  {
    id: "t-2",
    name: "John Davis",
    role: "Business Traveler",
    country: "USA",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content:
      "I needed a quick car rental and hotel for a conference in Kigali. Their team arranged everything within hours. Professional, reliable, and excellent service.",
    rating: 5,
  },
  {
    id: "t-3",
    name: "Aisha Mohammed",
    role: "Family Vacation",
    country: "Kenya",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    content:
      "Traveling with kids can be stressful, but Vizit Africa handled everything. The Lake Kivu resort they suggested was perfect for our family. We'll be back!",
    rating: 5,
  },
  {
    id: "t-4",
    name: "Marcus Chen",
    role: "Solo Explorer",
    country: "Singapore",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    content:
      "As a solo traveler, safety was my priority. Their local guides made me feel completely at ease while showing me hidden gems I'd never find on my own.",
    rating: 5,
  },
  {
    id: "t-5",
    name: "Emma Laurent",
    role: "Photographer",
    country: "France",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    content:
      "The golden hour at Akagera was magical. They knew exactly where to position us for the best shots. My portfolio has never looked better!",
    rating: 5,
  },
];

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  country: string;
  avatar: string;
  content: string;
  rating: number;
}

const allTestimonials = [...testimonials, ...testimonials, ...testimonials];
const col1 = allTestimonials.slice(0, 5);
const col2 = allTestimonials.slice(5, 10);
const col3 = allTestimonials.slice(10, 15);

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 bg-muted/30 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <SectionTitle
            overline="What They Say"
            title="Traveler Stories"
            description="Real stories from real trips. See why thousands of adventurers choose Vizit Africa."
            align="center"
            className="mb-0"
          />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[800px] overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          <TestimonialsColumn testimonials={col1} duration={45} />
          <TestimonialsColumn
            testimonials={col2}
            className="hidden md:block"
            duration={55}
          />
          <TestimonialsColumn
            testimonials={col3}
            className="hidden lg:block"
            duration={50}
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialsColumn({
  testimonials,
  className,
  duration = 10,
}: {
  testimonials: TestimonialData[];
  className?: string;
  duration?: number;
}) {
  return (
    <div className={className}>
      <motion.div
        animate={{
          y: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {testimonials.map((testimonial, index) => (
              <figure
                key={`${testimonial.id}-${i}-${index}`}
                className={cn(
                  "relative w-full rounded-3xl border bg-card p-8 shadow-xs",
                  "cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/20",
                )}
              >
                <blockquote className="text-sm leading-relaxed text-muted-foreground mb-6">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="relative size-10 rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <figcaption className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </figcaption>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </figure>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
