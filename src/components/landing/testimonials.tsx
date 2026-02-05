"use client";

import { testimonials } from "@/lib/dummy-data";
import { RiStarFill, RiDoubleQuotesL } from "@remixicon/react";
import Image from "next/image";

export function Testimonials() {
  return (
    <section className="py-20 bg-primary-subtle border-t border-border">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from real trips. See why thousands of adventurers
            choose Vizit Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-xl border border-border shadow-sm relative"
            >
              <RiDoubleQuotesL className="absolute top-6 right-6 size-10 text-primary/10" />

              <div className="flex gap-1 text-accent-warm mb-6">
                {[...Array(5)].map((_, i) => (
                  <RiStarFill
                    key={i}
                    className={`size-5 ${i < testimonial.rating ? "fill-current" : "fill-neutral-200"}`}
                  />
                ))}
              </div>

              <p className="text-foreground text-lg italic mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-neutral-200 overflow-hidden">
                  {/* Placeholder */}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
