"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";
import { TESTIMONIAL_AVATARS } from "@/lib/configs";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./section-title";

const testimonialKeys = ["1", "2", "3", "4", "5"] as const;

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  country: string;
  avatar: string;
  content: string;
}

export function Testimonials() {
  const t = useTranslations("Testimonials");

  const testimonials: TestimonialData[] = testimonialKeys.map((key, index) => ({
    id: `t-${key}`,
    name: t(`items.${key}.name`),
    role: t(`items.${key}.role`),
    country: t(`items.${key}.country`),
    avatar: TESTIMONIAL_AVATARS[index] || TESTIMONIAL_AVATARS[0],
    content: t(`items.${key}.content`),
  }));

  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const col1 = allTestimonials.slice(0, 5);
  const col2 = allTestimonials.slice(5, 10);
  const col3 = allTestimonials.slice(10, 15);

  return (
    <section className="marketing-section bg-surface-cream overflow-hidden relative isolate">
      <div className="marketing-container relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16 lg:mb-24">
          <SectionTitle
            overline={t("overline")}
            title={t("title")}
            description={t("description")}
            align="center"
            className="mb-0"
          />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 h-[800px] overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-surface-cream via-surface-cream/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-surface-cream via-surface-cream/80 to-transparent z-10 pointer-events-none" />

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
        className="flex flex-col gap-6 lg:gap-8 pb-6 lg:pb-8"
      >
        {[...new Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {testimonials.map((testimonial, index) => (
              <figure
                key={`${testimonial.id}-${i}-${index}`}
                className={cn(
                  "relative w-full rounded-2xl border border-border bg-white p-8 md:p-10 shadow-sm",
                  "transition-all duration-500 hover:shadow-md hover:border-primary/30 group",
                )}
              >
                <div className="text-[160px] leading-none text-primary/10 absolute -top-12 -left-4 font-display pointer-events-none select-none group-hover:text-primary/20 transition-colors duration-500">
                  &ldquo;
                </div>

                <blockquote className="font-display text-xl md:text-2xl leading-snug text-surface-ink mb-10 font-normal italic relative z-10 text-pretty">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center gap-4 border-t border-border-warm pt-6">
                  <div className="relative size-12 rounded-full overflow-hidden bg-surface-bone">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <figcaption className="text-sm font-sans font-medium text-surface-ink tracking-tight">
                      {testimonial.name}
                    </figcaption>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-surface-ink/50">
                      {testimonial.role} · {testimonial.country}
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
