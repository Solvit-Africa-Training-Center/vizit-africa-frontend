"use client";

import { RiArrowRightUpLine } from "@remixicon/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "./section-title";

gsap.registerPlugin(ScrollTrigger);

export function ServiceHighlights() {
  const t = useTranslations("ServiceHighlights");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".highlight-card");
      if (!cards) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      className="py-24 md:py-40 bg-background overflow-hidden"
      ref={containerRef}
    >
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <SectionTitle
            overline={t("overline")}
            title={t.rich("title", {
              br: () => <br className="hidden md:block" />,
            })}
            description={t("description")}
            className="mb-0 max-w-2xl"
          />
          <div className="hidden lg:flex justify-end">
            <Link href="/plan-trip">
              <Button
                variant="outline"
                className="rounded-full h-24 w-24 p-0 flex-col gap-1 border-primary/20 hover:bg-primary hover:text-white group transition-all duration-500 shadow-xl shadow-primary/5"
              >
                <RiArrowRightUpLine className="size-6 group-hover:rotate-45 transition-transform duration-500" />
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold">
                  Start
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          {/* Main Narrative Feature */}
          <div className="highlight-card relative group aspect-16/9 md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-card border border-border/50">
            <Image
              src="/images/person-waiting-at-airport.jpg"
              alt="Flights"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-primary" />
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em]">
                  01 / Manual Sourcing
                </span>
              </div>
              <h3 className="text-3xl md:text-5xl font-display text-white uppercase leading-[0.9] tracking-tighter mb-6">
                {t("items.flights.title")}
              </h3>
              <p className="text-white/60 text-base md:text-lg font-light leading-relaxed">
                {t("items.flights.description")}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:px-12">
            {/* The Bundle Narrative */}
            <div className="highlight-card relative group aspect-4/3 rounded-2xl overflow-hidden shadow-card border border-border/50 md:-mt-4">
              <Image
                src="/images/hotel.jpg"
                alt="Packages"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] mb-4 block">
                  02 / All-In-One
                </span>
                <h3 className="text-2xl md:text-3xl font-display text-white uppercase leading-none tracking-tighter mb-4">
                  {t("items.packages.title")}
                </h3>
                <p className="text-white/60 text-sm font-light leading-relaxed max-w-sm">
                  {t("items.packages.description")}
                </p>
              </div>
            </div>

            {/* The Human Narrative */}
            <div className="highlight-card relative group aspect-4/3 rounded-2xl overflow-hidden shadow-card border border-border/50 md:mt-12">
              <Image
                src="/images/guide.jpg"
                alt="Concierge"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] mb-4 block">
                  03 / Human Touch
                </span>
                <h3 className="text-2xl md:text-3xl font-display text-white uppercase leading-none tracking-tighter mb-4">
                  {t("items.concierge.title")}
                </h3>
                <p className="text-white/60 text-sm font-light leading-relaxed max-w-sm">
                  {t("items.concierge.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
