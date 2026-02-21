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
    <section className="relative py-24 md:py-32 bg-muted/30 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <SectionTitle
            overline={t("overline")}
            title={t("title")}
            description={t("description")}
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
                  &ldquo;{testimonial.content}&rdquo;
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
                    <figcaption className="text-sm font-medium text-foreground">
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
