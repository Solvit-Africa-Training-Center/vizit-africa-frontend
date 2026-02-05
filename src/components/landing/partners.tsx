"use client";

import { partnerLogos } from "@/lib/dummy-data";
import Image from "next/image";

export function Partners() {
  return (
    <section className="bg-white border-y border-border py-10">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted by travelers from 15+ countries and partnered with
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 grayscale opacity-70">
          {partnerLogos.map((partner) => (
            <div key={partner.name} className="flex items-center gap-2">
              {/* Fallback for logo if image fails or for prototyping */}
              <div className="text-xl font-bold font-display text-muted-foreground">
                {partner.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
