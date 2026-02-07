"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RiArrowRightLine } from "@remixicon/react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";

export function Hero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((currentSlide + 1) % SLIDES.length);
    }, 8000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = SLIDES[currentSlide];

  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] min-h-[700px] w-full overflow-hidden bg-[oklch(14%_0_0)]"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
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
              alt={slide.heading1 + " " + slide.heading2}
              className="w-full h-full object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
      </motion.div>

      <div className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>
      <motion.div
        style={{ opacity }}
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
                  {slide.subheading}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-2">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl md:text-9xl lg:text-[11rem] font-black font-display text-white uppercase leading-[0.8] tracking-tighter"
                >
                  {slide.heading1}
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
                    {slide.heading2}
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg md:text-xl text-white/80 max-w-md font-light leading-relaxed mb-6 md:mb-4"
                >
                  {slide.description}
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
            <Button
              size="lg"
              className="rounded-full h-16 px-10 text-lg bg-primary hover:bg-primary-light text-white border-none transition-transform hover:scale-105 w-full md:w-auto"
            >
              Start Planning
              <RiArrowRightLine />
            </Button>

            <div className="lg:hidden flex items-center gap-4">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSlideChange(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
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
      </motion.div>

      <div className="hidden lg:flex absolute right-10 bottom-10 z-30 flex-col items-end gap-12">
        <div className="flex flex-col gap-4 text-right">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
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
                  className="w-[280px] p-0 bg-black/80 backdrop-blur-md border-white/10 overflow-hidden"
                >
                  <div className="relative h-32 w-full">
                    <Image
                      src={slide.image}
                      alt={slide.heading1}
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-1">
                        {slide.subheading}
                      </p>
                      <h3 className="text-xl font-display font-medium text-white uppercase leading-tight">
                        {slide.heading1} {slide.heading2}
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
              Volcanoes N.P.
            </span>
            1°28'S, 29°32'E
          </div>
          <div>
            <span className="block text-white mb-1">Local Time</span>
            <span className="tabular-nums">GMT+2 (CAT)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1546422724-3c4be0b20cb5?q=90&w=2400&auto=format&fit=crop",
    subheading: "Visit Rwanda 2026",
    heading1: "Majestic",
    heading2: "Horizon",
    description:
      "Discover the untold stories of the heart of Africa. Where mist meets mountain, and silence speaks volumes.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1547471080-7528385f7017?q=90&w=2400&auto=format&fit=crop",
    subheading: "Wildlife Sanctuary",
    heading1: "Wild",
    heading2: "Heart",
    description:
      "Experience the pulse of the jungle and the serene beauty of our protected highlands.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517309995815-46fd4252e1f4?q=90&w=2400&auto=format&fit=crop",
    subheading: "Gorilla Highlands",
    heading1: "Mist",
    heading2: "Valley",
    description:
      "Encounter gentle giants in their natural habitat. A profound connection with nature's rarest treasures.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1505245208761-ba872912fac0?q=90&w=2400&auto=format&fit=crop",
    subheading: "Lake Kivu",
    heading1: "Serene",
    heading2: "Shores",
    description:
      "Relax by the emerald waters of Lake Kivu. A paradise for relaxation, adventure, and reflection.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1489447068241-b3490214e879?q=90&w=2400&auto=format&fit=crop",
    subheading: "Vibrant Culture",
    heading1: "Urban",
    heading2: "Rhythm",
    description:
      "Feel the energy of Kigali. A city of innovation, art, and warm hospitality rising from the hills.",
  },
];
