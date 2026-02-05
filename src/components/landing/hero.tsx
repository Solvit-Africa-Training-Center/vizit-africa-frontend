"use client";

import { Button } from "@/components/ui/button";
import { RiArrowRightLine, RiArrowDownLine } from "@remixicon/react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useRef } from "react";

export function Hero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Parallax for background
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] min-h-[800px] w-full overflow-hidden bg-zinc-950"
    >
      {/* Background with Parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1547619292-240402b5ae5d?q=80&w=2600&auto=format&fit=crop"
          alt="Rwanda Landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      </motion.div>

      {/* 1. Cinematic Film Grain Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      {/* Editorial Content Layout */}
      <motion.div
        style={{ opacity }}
        className="relative z-30 container mx-auto px-5 md:px-10 h-full flex flex-col justify-end pb-24 md:pb-32"
      >
        <div className="max-w-[1400px]">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-[1px] bg-white/60" />
            <span className="text-white/80 uppercase tracking-[0.3em] text-xs font-medium">
              Visit Rwanda 2026
            </span>
          </motion.div>

          {/* Massive Headline - Split Line */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-9xl lg:text-[11rem] font-black font-display text-white uppercase leading-[0.8] tracking-tighter"
            >
              Majestic
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
                className="text-7xl md:text-9xl lg:text-[11rem] font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white uppercase leading-[0.8] tracking-tighter"
              >
                Horizon
              </motion.h1>
            </div>

            {/* Introduction Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-white/80 max-w-md font-light leading-relaxed mb-6 md:mb-4"
            >
              Discover the untold stories of the heart of Africa. Where mist
              meets mountain, and silence speaks volumes.
            </motion.p>
          </div>

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex items-center justify-between"
          >
            <Button
              size="lg"
              className="rounded-full h-16 px-10 text-lg bg-primary hover:bg-primary-light text-white border-none transition-transform hover:scale-105"
            >
              Start Planning
              <RiArrowRightLine className="ml-2 size-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Elements - Professional Data */}
      <div className="hidden lg:block absolute right-10 bottom-10 z-30">
        <div className="flex flex-col gap-6 text-right text-white/50 font-mono text-[10px] uppercase tracking-[0.2em] border-r border-white/20 pr-6">
          <div className="group cursor-default">
            <span className="block text-white mb-1 group-hover:text-primary transition-colors">
              Volcanoes N.P.
            </span>
            1°28'S, 29°32'E
          </div>
          <div>
            <span className="block text-white mb-1">Elevation</span>
            2,500m — 4,507m
          </div>
          <div>
            <span className="block text-white mb-1">Local Time</span>
            <span className="tabular-nums">GMT+2 (CAT)</span>
          </div>
          <div className="pt-4 border-t border-white/10 mt-2">
            <span className="block text-white mb-1">Status</span>
            <span className="flex items-center justify-end gap-2 text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Permits Available
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
