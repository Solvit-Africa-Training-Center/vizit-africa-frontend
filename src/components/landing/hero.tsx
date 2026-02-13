"use client";

import { HERO_SLIDES } from "@/lib/landing-data";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { TripRequestDialog } from "./trip-request-dialog";
import { Button } from "@/components/ui/button";
import { RiPlaneLine } from "@remixicon/react";

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

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

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
      className="relative h-[100dvh] min-h-[700px] w-full overflow-hidden bg-[oklch(14%_0_0)]"
    >
      <div
        ref={parallaxRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 will-change-transform"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slide.image}
              fill
              alt={`${slideContent.heading1} ${slideContent.heading2}`}
              className="w-full h-full object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <div
        ref={contentRef}
        className="relative z-30 container mx-auto px-5 md:px-10 h-full flex flex-col justify-end pb-8 md:pb-12"
      >
        <div className="max-w-[1400px] w-full pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="w-12 h-px bg-primary-foreground/60" />
                <span className="text-primary-foreground/80 uppercase tracking-widest text-xs font-medium">
                  {slideContent.subheading}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-2">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-6xl lg:text-7xl font-medium font-display text-primary-foreground uppercase leading-[0.9] tracking-tighter"
                >
                  {slideContent.heading1}
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.4,
                      delay: 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-4xl md:text-6xl lg:text-7xl font-medium font-display text-transparent bg-clip-text bg-linear-to-r from-primary-light to-white uppercase leading-[0.9] tracking-tighter"
                  >
                    {slideContent.heading2}
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="text-base md:text-lg text-primary-foreground/80 max-w-md font-light leading-relaxed mb-4 md:mb-2"
                >
                  {slideContent.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-40 mt-12 pointer-events-auto">
          <TripRequestDialog 
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            trigger={
              <Button size="lg" className="font-display uppercase tracking-widest text-sm h-14 px-8 rounded-full shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300">
                <RiPlaneLine className="mr-2 size-5" />
                Start Your Journey
              </Button>
            } 
          />
        </div>

        <div className="lg:hidden flex items-center gap-4 mt-6">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSlideChange(index)}
              className={`h-0.5 transition-all duration-500 ${
                index === currentSlide
                  ? "w-12 bg-primary-foreground"
                  : "w-4 bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* desktop slide navigation */}
      <div className="hidden lg:flex absolute right-10 bottom-10 z-30 flex-col items-end gap-12">
        <div className="flex flex-col gap-4 text-right">
          {HERO_SLIDES.map((s, index) => {
            const isActive = index === currentSlide;
            const hoverContent = {
              subheading: t(`slides.${s.key}.subheading`),
              heading1: t(`slides.${s.key}.heading1`),
              heading2: t(`slides.${s.key}.heading2`),
            };
            return (
              <HoverCard key={index}>
                <HoverCardTrigger
                  type="button"
                  onClick={() => handleSlideChange(index)}
                  className={`group flex items-center justify-end gap-3 transition-colors duration-300 ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-primary-foreground/40 hover:text-primary-foreground/80"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                    0{index + 1}
                  </span>

                  <span
                    className={`h-px bg-current transition-all duration-500 ${
                      isActive ? "w-8 bg-primary" : "w-4 group-hover:w-6"
                    }`}
                  />
                </HoverCardTrigger>
                <HoverCardContent
                  side="left"
                  align="center"
                  sideOffset={20}
                  className="w-[280px] p-0 bg-black/80 backdrop-blur-md border-white/10 overflow-hidden rounded-sm"
                >
                  <div className="relative h-32 w-full">
                    <Image
                      src={s.image}
                      alt={hoverContent.heading1}
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70 mb-1">
                        {hoverContent.subheading}
                      </p>
                      <h3 className="text-xl font-display font-medium text-primary-foreground uppercase leading-tight">
                        {hoverContent.heading1} {hoverContent.heading2}
                      </h3>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>

        <div className="flex flex-col gap-6 text-right text-primary-foreground/50 font-mono text-[10px] uppercase tracking-[0.2em] border-r border-white/20 pr-6">
          <div className="group cursor-default">
            <span className="block text-primary-foreground mb-1 group-hover:text-primary transition-colors">
              {t("location")}
            </span>
            {t("coordinates")}
          </div>
          <div>
            <span className="block text-primary-foreground mb-1">
              {tCommon("localTime")}
            </span>
            <span className="tabular-nums">GMT+2 (CAT)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
