"use client";

import { testimonials } from "@/lib/dummy-data";
import { RiDoubleQuotesL } from "@remixicon/react";

export function Testimonials() {
  return (
    <section className="py-24 bg-zinc-950 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-20 max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
            Traveler Stories
          </h2>
          <p className="text-white/60 text-lg font-light">
            Real stories from real trips. See why thousands of adventurers
            choose Vizit Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative group bg-white/5 p-8 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <RiDoubleQuotesL className="size-10 text-white/20 mb-6 group-hover:text-primary transition-colors duration-500" />

              <p className="text-lg font-light leading-relaxed text-white/90 mb-8 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
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
