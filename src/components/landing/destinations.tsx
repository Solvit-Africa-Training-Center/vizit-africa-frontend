"use client";

import { RiArrowRightUpLine } from "@remixicon/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const regions = [
  {
    id: "volcanoes",
    name: "Volcanoes",
    subtitle: "The Kingdom of Gorillas",
    image:
      "https://images.unsplash.com/photo-1662612732223-1fe6ea43263e?q=90&w=1600&auto=format&fit=crop",
    desc: "Mist-covered peaks and rare encounters in the Virunga Massif.",
  },
  {
    id: "akagera",
    name: "Akagera",
    subtitle: "Savannah Wilderness",
    image:
      "https://images.unsplash.com/photo-1621268405207-3dfc641fceeb?q=90&w=1600&auto=format&fit=crop",
    desc: "Where the Big Five roam free across golden plains.",
  },
  {
    id: "nyungwe",
    name: "Nyungwe",
    subtitle: "Ancient Rainforest",
    image:
      "https://images.unsplash.com/photo-1489640818597-89b1edc97db5?q=90&w=1600&auto=format&fit=crop",
    desc: "A primate paradise suspended in the clouds.",
  },
  {
    id: "kivu",
    name: "Lake Kivu",
    subtitle: "Inland Sea",
    image:
      "https://images.unsplash.com/photo-1514548383638-cef9251a73ec?q=90&w=1600&auto=format&fit=crop",
    desc: "Serene waters, islands, and the singing fishermen.",
  },
];

export function Destinations() {
  const [activeId, setActiveId] = useState<string | null>("volcanoes");

  return (
    <section className="py-32 bg-slate-50 relative">
      <div className="container max-w-7xl mx-auto px-5 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Regions
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            From the mist-covered Virunga volcanoes to the golden savannah of
            Akagera.
          </p>
        </motion.div>
      </div>

      <div className="container max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row h-[550px] w-full gap-2 md:gap-4">
          {regions.map((region) => {
            const isActive = activeId === region.id;
            return (
              <motion.div
                key={region.id}
                layout
                onClick={() => setActiveId(region.id)}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-3xl",
                  isActive ? "flex-[10]" : "flex-[2] hover:flex-[3]",
                )}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover"
                  />
                  <div
                    className={cn(
                      isActive
                        ? "bg-black/20"
                        : "bg-black/50 group-hover:bg-black/30",
                    )}
                  />
                </div>

                {/* Inactive State: Vertical Text */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                    isActive ? "opacity-0 pointer-events-none" : "opacity-100",
                  )}
                >
                  <h3 className="text-2xl font-bold font-display uppercase text-white tracking-widest [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
                    {region.name}
                  </h3>
                </div>

                {/* Active State: Rich Content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent"
                    >
                      <div className="max-w-xl">
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="inline-block px-3 py-1 mb-4 text-xs font-mono uppercase tracking-widest text-white border border-white/30 rounded-full backdrop-blur-md"
                        >
                          {region.subtitle}
                        </motion.span>
                        <h3 className="text-5xl md:text-7xl font-black font-display uppercase text-white tracking-tighter mb-6 leading-[0.9]">
                          {region.name}
                        </h3>
                        <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed mb-8">
                          {region.desc}
                        </p>
                        <button
                          type="button"
                          className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/90 transition-colors"
                        >
                          Explore Region
                          <RiArrowRightUpLine className="size-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
