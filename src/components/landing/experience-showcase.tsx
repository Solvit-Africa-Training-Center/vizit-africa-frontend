"use client";

import { RiArrowRightUpLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const experiences = [
  {
    id: "bisate",
    name: "Bisate Lodge",
    location: "Volcanoes N.P.",
    description:
      "Nestled in the amphitheatre of an eroded volcanic cone, Bisate offers a luxurious base for gorilla trekking with sustainable architecture.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2600&auto=format&fit=crop", // Luxury lodge vibe
  },
  {
    id: "magashi",
    name: "Magashi Camp",
    location: "Akagera N.P.",
    description:
      "A classic safari camp overlooking Lake Rwanyakazinga, offering exclusive access to Rwanda's only savannah big game area.",
    image:
      "https://images.unsplash.com/photo-1547619292-240402b5ae5d?q=80&w=2600&auto=format&fit=crop", // Safari vibe
  },
  {
    id: "nyungwe",
    name: "Nyungwe House",
    location: "Nyungwe Forest",
    description:
      "Set amidst the rich tea plantations on the edge of the ancient rainforest, offering wellness and chimpanzee trekking.",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb746c?q=80&w=2600&auto=format&fit=crop", // Forest vibe
  },
];

export function ExperienceShowcase() {
  const [activeId, setActiveId] = useState(experiences[0].id);

  return (
    <section className="bg-background py-24 md:py-32 relative">
      <div className="container mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Sticky Image Section */}
          <div className="md:w-1/2 h-[50vh] md:h-[80vh] sticky top-24 overflow-hidden rounded-2xl">
            <AnimatePresence mode="popLayout">
              {experiences.map(
                (exp) =>
                  exp.id === activeId && (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full bg-black rounded-2xl overflow-hidden" // Added rounded-2xl
                    >
                      <img
                        src={exp.image}
                        alt={exp.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">
                          {exp.location}
                        </p>
                        <h3 className="text-4xl font-black font-display uppercase tracking-tight">
                          {exp.name}
                        </h3>
                      </div>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>

          {/* Scrollable Text Section */}
          <div className="md:w-1/2 flex flex-col gap-24 py-12 md:py-24">
            <div className="mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Featured Stays
              </h2>
              <p className="text-muted-foreground text-lg font-light">
                We partner with the most exclusive lodges that share our
                commitment to conservation and luxury.
              </p>
            </div>

            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                onViewportEnter={() => setActiveId(exp.id)}
                viewport={{ amount: 0.5, margin: "-100px" }}
                className={cn(
                  "group cursor-pointer border-l-2 pl-8 transition-colors duration-500 py-4",
                  activeId === exp.id ? "border-primary" : "border-border",
                )}
              >
                <h3
                  className={cn(
                    "text-3xl font-black uppercase mb-4 transition-colors duration-300",
                    activeId === exp.id
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {exp.name}
                </h3>
                <p className="text-muted-foreground text-lg font-light leading-relaxed mb-6 group-hover:text-foreground transition-colors duration-300">
                  {exp.description}
                </p>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all duration-300",
                    activeId === exp.id
                      ? "text-primary translate-x-2"
                      : "text-muted-foreground",
                  )}
                >
                  View Lodge <RiArrowRightUpLine className="size-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
