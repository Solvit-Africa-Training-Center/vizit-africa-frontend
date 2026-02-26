"use client";

import { useGSAP } from "@gsap/react";
import { RiArrowRightUpLine } from "@remixicon/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { HERO_SLIDES } from "@/lib/configs";
import { TripRequestDialog } from "./trip-request-dialog";
import { cn } from "@/lib/utils";
import { TextMorph } from "../ui/morph-text";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations("Hero");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const slide = HERO_SLIDES[currentSlide];
  const slideContent = {
    title: t(`slides.${slide.key}.title`),
    code: t(`slides.${slide.key}.code`),
    subheading: t(`slides.${slide.key}.subheading`),
    heading1: t(`slides.${slide.key}.heading1`),
    heading2: t(`slides.${slide.key}.heading2`),
    description: t(`slides.${slide.key}.description`),
  };

  // ── GSAP: Parallax on image only — logic unchanged ──────────────
  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.to(".hero-parallax-wrapper", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] bg-surface-ink overflow-hidden"
    >
      {/* ── Grain — photographic quality, very subtle ──────────────── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-[0.04]"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* ── Full-bleed image — the hero ────────────────────────────── */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] hero-parallax-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-img-${slide.id}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slide.image}
              fill
              alt={slide.title}
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Gradients — let image breathe, text reads ──────────────── */}
      {/* Bottom: content area */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent z-10 pointer-events-none" />
      {/* Left edge: faint depth for headline */}
      <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-black/35 to-transparent z-10 pointer-events-none" />

      {/* ── Location badge — top right, minimal ────────────────────── */}
      <div className="absolute top-28 right-6 md:right-10 z-20">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-black/25 backdrop-blur-md border border-white/[0.08]">
          <div className="relative flex size-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full size-1.5 bg-primary" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
            <TextMorph>{slideContent.code}</TextMorph>
          </span>
        </div>
      </div>

      {/* ── Bottom content ──────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-10 lg:px-16 pb-10 md:pb-14">
        {/* Amber horizon line — thin, intentional */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-0">
          {/* ── LEFT: Overline + headline + description ─────────────── */}
          <div className="flex flex-col gap-4 max-w-2xl">
            {/* Overline */}
            <div className="flex items-center gap-3">
              <div className="h-px w-5 bg-primary shrink-0" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary">
                <TextMorph>{slideContent.subheading}</TextMorph>
              </span>
            </div>

            {/* Headline — sized to impress, not overwhelm */}
            <div className="font-display text-[2.6rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] leading-[0.93] tracking-tight font-light text-white overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`headline-${slide.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block">{slideContent.heading1}</span>
                  <span className="block italic text-primary-foreground font-light">
                    {slideContent.heading2}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${slide.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="font-sans text-sm text-white font-light leading-relaxed max-w-[300px] lg:max-w-[360px]"
              >
                {slideContent.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: CTA + slide nav ───────────────────────────────── */}
          <div className="flex flex-row-reverse lg:flex-col items-end justify-between lg:justify-end gap-6 lg:gap-7 shrink-0">
            {/* CTA button */}
            <TripRequestDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              trigger={
                <button
                  type="button"
                  className={cn(
                    "group flex items-center gap-2.5 px-6 py-3.5 rounded-full",
                    "bg-primary text-white",
                    "font-sans font-medium text-[11px] uppercase tracking-widest",
                    "transition-all duration-500",
                    "shadow-lg",
                    "hover:shadow-lg",
                    "hover:-translate-y-px",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  )}
                >
                  <span>{t("planJourney")}</span>
                  <RiArrowRightUpLine className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              }
            />

            {/* Slide navigation lines */}
            <div className="flex items-center gap-2.5">
              {HERO_SLIDES.map((s, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    type="button"
                    aria-label={`Go to slide ${idx + 1}`}
                    className="group flex items-center py-2 focus-visible:outline-none"
                  >
                    <div
                      className={cn(
                        "h-px rounded-full transition-all duration-500 relative overflow-hidden",
                        isActive
                          ? "w-9 bg-white/20"
                          : "w-3.5 bg-white/15 group-hover:bg-white/35 group-hover:w-5",
                      )}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 8, ease: "linear" }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
              <span className="font-mono text-[8.5px] text-white/25 tracking-[0.12em] ml-0.5">
                {String(currentSlide + 1).padStart(2, "0")}&nbsp;/&nbsp;
                {String(HERO_SLIDES.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Ghost destination name — barely visible, adds depth */}
        <div className="mt-4 lg:mt-5 overflow-hidden">
          <motion.span
            key={`dest-ghost-${slide.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-display font-light text-[8vw] md:text-[5.5vw] text-white/[0.055] uppercase tracking-[0.18em] leading-none select-none pointer-events-none block"
          >
            <TextMorph>{slideContent.title}</TextMorph>
          </motion.span>
        </div>
      </div>
    </section>
  );
}
