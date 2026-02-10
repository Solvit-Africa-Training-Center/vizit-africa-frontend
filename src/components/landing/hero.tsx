"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Magnetic } from "@/components/ui/magnetic";
import { RiArrowRightLine } from "@remixicon/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const HERO_SLIDES = [
  {
    id: 1,
    image: "/bookflight.jpeg",
    key: "1",
  },
  {
    id: 2,
    image:
      "/Kigali.jpeg", // Hotel view
    key: "2",
  },
  {
    id: 3,
    image:
      "/ca.jpg", // Driving
    key: "3",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=90&w=2400&auto=format&fit=crop", // Guide/Discussion
    key: "4",
  },
  {
    id: 5,
    image:
      "/plan.jpg", // Travel/Planning
    key: "5",
  },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations("Hero");
  const tCommon = useTranslations("Common");

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
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

        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>
      <div
        ref={contentRef}
        className="relative z-30 container mx-auto px-5 md:px-10 h-full flex flex-col justify-end pb-24 md:pb-32"
      >
        <div className="max-w-[1400px]">
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
                className="flex items-center gap-4 mb-8"
              >
                <div className="w-12 h-px bg-white/60" />
                <span className="text-white/80 uppercase tracking-[0.3em] text-xs font-medium">
                  {slideContent.subheading}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-2">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl md:text-9xl lg:text-[11rem] font-black font-display text-white uppercase leading-[0.8] tracking-tighter"
                >
                  {slideContent.heading1}
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-7xl md:text-9xl lg:text-[11rem] font-black font-display text-transparent bg-clip-text bg-linear-to-r from-primary-light to-white uppercase leading-[0.8] tracking-tighter"
                  >
                    {slideContent.heading2}
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg md:text-xl text-white/80 max-w-md font-light leading-relaxed mb-6 md:mb-4"
                >
                  {slideContent.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-col md:flex-row md:items-center gap-8"
          >
            <Magnetic>
              <Button
                size="lg"
                className="rounded-sm h-16 px-10 text-lg bg-primary hover:bg-primary-light text-white border-none transition-transform hover:scale-105 w-full md:w-auto"
              >
                {tCommon("startPlanning")}
                <RiArrowRightLine />
              </Button>
            </Magnetic>

            <div className="lg:hidden flex items-center gap-4">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSlideChange(index)}
                  className={`h-0.5 transition-all duration-500 ${
                    index === currentSlide
                      ? "w-12 bg-white"
                      : "w-4 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

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
                      ? "text-white"
                      : "text-white/40 hover:text-white/80"
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
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-1">
                        {hoverContent.subheading}
                      </p>
                      <h3 className="text-xl font-display font-medium text-white uppercase leading-tight">
                        {hoverContent.heading1} {hoverContent.heading2}
                      </h3>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>

        <div className="flex flex-col gap-6 text-right text-white/50 font-mono text-[10px] uppercase tracking-[0.2em] border-r border-white/20 pr-6">
          <div className="group cursor-default">
            <span className="block text-white mb-1 group-hover:text-primary transition-colors">
              {t("location")}
            </span>
            {t("coordinates")}
          </div>
          <div>
            <span className="block text-white mb-1">
              {tCommon("localTime")}
            </span>
            <span className="tabular-nums">GMT+2 (CAT)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
