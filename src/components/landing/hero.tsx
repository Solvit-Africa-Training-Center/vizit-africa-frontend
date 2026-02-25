"use client";

import { useGSAP } from "@gsap/react";
import { RiPlaneLine } from "@remixicon/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/lib/configs";
import { TripRequestDialog } from "./trip-request-dialog";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((currentSlide + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const slide = HERO_SLIDES[currentSlide];
  const slideContent = {
    subheading: t(`slides.${slide.key}.subheading`),
    heading1: t(`slides.${slide.key}.heading1`),
    heading2: t(`slides.${slide.key}.heading2`),
    description: t(`slides.${slide.key}.description`),
  };

  useGSAP(
    () => {
      if (!containerRef.current || !parallaxRef.current || !contentRef.current)
        return;

      gsap.to(parallaxRef.current, {
        y: 400,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "center top",
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-dvh w-full bg-surface-cream pt-24 lg:pt-0 isolate overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <div className="marketing-container h-[100dvh] min-h-[700px] flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 pb-24 lg:pb-0">
        {/* Left Panel: Typography */}
        <div className="flex flex-col justify-center h-full relative z-20 order-2 lg:order-1 pt-8 lg:pt-0 max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 relative">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50"></div>
                </div>
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-surface-ink/60 font-medium">
                  Rwanda · East Africa · Est. 2023
                </span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-medium leading-[0.9] tracking-tighter text-surface-ink uppercase mb-6 drop-shadow-sm flex flex-col items-start text-balance">
                <span className="block">{slideContent.heading1}</span>
                <span className="block text-primary italic pr-2">
                  {slideContent.heading2}
                </span>
                <span
                  className="block text-transparent italic"
                  style={{ WebkitTextStroke: "1px var(--surface-ink)" }}
                >
                  {slideContent.subheading}
                </span>
              </h1>

              <p className="font-sans text-base sm:text-lg text-surface-ink/70 font-light leading-relaxed max-w-md text-pretty mb-8 lg:mb-12">
                {slideContent.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-4">
            <TripRequestDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              trigger={
                <Button
                  size="lg"
                  className="rounded-full font-sans font-semibold uppercase tracking-[0.12em] text-xs h-12 px-8 shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90 text-white shrink-0"
                >
                  <RiPlaneLine className="mr-2 size-4" />
                  {tCommon("startPlanning")}
                </Button>
              }
            />
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border-warm max-w-lg">
            <div>
              <div className="font-display text-2xl text-surface-ink">
                1.2K+
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-surface-ink/50 mt-1">
                Travelers
              </div>
            </div>
            <div>
              <div className="font-display text-2xl text-surface-ink">18</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-surface-ink/50 mt-1">
                Nationalities
              </div>
            </div>
            <div>
              <div className="font-display text-2xl text-primary flex items-baseline gap-1">
                4.9 <span className="text-sm">★</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-surface-ink/50 mt-1">
                Rating
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Img */}
        <div className="h-[40vh] min-h-[300px] lg:h-full relative z-10 order-1 lg:order-2 flex flex-col justify-center lg:py-16">
          <div className="relative w-full h-full lg:max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl bg-surface-bone p-2 lg:p-4">
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-black/5">
              <div
                ref={parallaxRef}
                className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform"
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`img-${slide.id}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={slide.image}
                      fill
                      alt={`${slideContent.heading1} ${slideContent.heading2}`}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent mix-blend-overlay" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="absolute -bottom-4 lg:bottom-12 -left-4 lg:-left-12 bg-surface-cream px-6 py-4 rounded-xl shadow-xl border border-border flex items-center gap-4 z-20">
              <div className="w-10 h-10 rounded-full bg-surface-bone flex items-center justify-center shrink-0">
                <RiPlaneLine className="w-4 h-4 text-surface-ink" />
              </div>
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`tag-${slide.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="font-display text-lg text-surface-ink leading-none mb-1">
                      {slide.title}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-surface-ink/50">
                      Destination
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-2 lg:right-6 mix-blend-difference hidden sm:block pointer-events-none">
              <div
                className="writing-vertical-rl rotate-180 font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase whitespace-nowrap"
                style={{ writingMode: "vertical-rl" }}
              >
                1°56′S 30°3′E
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Departure Strip */}
      <div className="absolute bottom-0 left-0 w-full bg-surface-muted border-t border-primary/20 z-30 overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-max px-6 h-12">
          {HERO_SLIDES.map((s, idx) => (
            <button
              type="button"
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`flex items-center gap-4 px-8 border-r border-white/5 last:border-0 cursor-pointer hover:bg-white/5 transition-colors h-full ${currentSlide === idx ? "bg-white/5" : ""}`}
            >
              <span className="font-mono text-[10px] text-white/40">
                {s.code}
              </span>
              <span
                className={`font-display uppercase text-xs tracking-widest ${currentSlide === idx ? "text-white" : "text-white/60"}`}
              >
                {s.title}
              </span>
              {currentSlide === idx ? (
                <span className="px-2 py-0.5 rounded-full bg-primary-light/10 text-primary-light font-mono text-[8px] tracking-wider uppercase border border-primary-light/30 shadow-[0_0_8px_rgba(var(--primary-light),0.3)]">
                  Boarding
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-mono text-[8px] tracking-wider uppercase border border-white/10">
                  Available
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
