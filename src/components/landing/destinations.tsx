"use client";

import { RiArrowRightUpLine } from "@remixicon/react";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const regions = [
  {
    id: "volcanoes",
    name: "Volcanoes",
    subtitle: "The Kingdom of Gorillas",
    image:
      "https://images.unsplash.com/photo-1664303847960-586318f59035?q=80&w=2600&auto=format&fit=crop",
    desc: "Mist-covered peaks and rare encounters in the Virunga Massif.",
  },
  {
    id: "akagera",
    name: "Akagera",
    subtitle: "Savannah Wilderness",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2600&auto=format&fit=crop",
    desc: "Where the Big Five roam free across golden plains.",
  },
  {
    id: "nyungwe",
    name: "Nyungwe",
    subtitle: "Ancient Rainforest",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2600&auto=format&fit=crop",
    desc: "A primate paradise suspended in the clouds.",
  },
  {
    id: "kivu",
    name: "Lake Kivu",
    subtitle: "Inland Sea",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2600&auto=format&fit=crop",
    desc: "Serene waters, islands, and the singing fishermen.",
  },
];

export function Destinations() {
  const [activeId, setActiveId] = useState<string | null>("volcanoes");

  return (
    <section className="py-24 bg-zinc-950 relative">
      <div className="container mx-auto px-5 mb-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Regions
          </h2>
          <p className="text-white/60 text-lg font-light">
            From the mist-covered Virunga volcanoes to the golden savannah of
            Akagera.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-5">
        <div className="h-[70vh] flex flex-col md:flex-row w-full overflow-hidden md:rounded-2xl">
          {regions.map((region) => (
            <motion.div
              key={region.id}
              layout
              onClick={() => setActiveId(region.id)}
              className={cn(
                "relative h-full cursor-pointer overflow-hidden border-r border-white/5 group transition-[flex] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                activeId === region.id
                  ? "flex-[5]"
                  : "flex-[1] hover:flex-[1.5]",
              )}
            >
              {/* background image */}
              <div className="absolute inset-0">
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out scale-105 group-hover:scale-110"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-black/60 transition-opacity duration-500",
                    activeId === region.id
                      ? "opacity-20 translate-x-0"
                      : "opacity-60 group-hover:opacity-40",
                  )}
                />
              </div>

              <div
                className={cn(
                  "absolute bottom-8 left-8 origin-bottom-left -rotate-90 whitespace-nowrap z-20 transition-opacity duration-300",
                  activeId === region.id
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100",
                )}
              >
                <span className="text-2xl font-black uppercase text-white tracking-widest">
                  {region.name}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {activeId === region.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute bottom-0 left-0 p-8 md:p-16 z-20 w-full bg-linear-to-t from-black/80 to-transparent"
                  >
                    <h3 className="text-6xl md:text-8xl font-black font-serif uppercase text-white tracking-tighter mb-2 leading-[0.8]">
                      {region.name}
                    </h3>
                    <p className="text-primary font-mono uppercase tracking-widest text-sm mb-6">
                      {region.subtitle}
                    </p>
                    <p className="text-white/80 max-w-lg text-lg font-light mb-8">
                      {region.desc}
                    </p>

                    <button
                      type="button"
                      className="flex items-center gap-3 text-white uppercase font-bold tracking-[0.2em] group/btn"
                    >
                      Discover Region
                      <span className="bg-primary rounded-full p-2 group-hover/btn:rotate-45 transition-transform duration-300 text-foreground">
                        <RiArrowRightUpLine className="w-4 h-4 text-white" />
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
