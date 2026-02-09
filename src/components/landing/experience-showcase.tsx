"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { RiArrowRightLine } from "@remixicon/react";

const experiences = [
  {
    id: 1,
    title: "Mountain Gorillas",
    location: "Volcanoes National Park",
    image:
      "https://images.unsplash.com/photo-1546422724-3c4be0b20cb5?q=90&w=1600&auto=format&fit=crop",
    description: "Face-to-face encounters with gentle giants.",
  },
  {
    id: 2,
    title: "Chimpanzee Trekking",
    location: "Nyungwe Forest",
    image:
      "https://images.unsplash.com/photo-1547471080-7528385f7017?q=90&w=1600&auto=format&fit=crop",
    description: "Ancient rainforests teeming with primates.",
  },
  {
    id: 3,
    title: "Game Drive Safari",
    location: "Akagera National Park",
    image:
      "https://images.unsplash.com/photo-1517309995815-46fd4252e1f4?q=90&w=1600&auto=format&fit=crop",
    description: "Lions, rhinos, and elephants in the savannah.",
  },
  {
    id: 4,
    title: "Lake Kivu Relaxation",
    location: "Western Province",
    image:
      "https://images.unsplash.com/photo-1505245208761-ba872912fac0?q=90&w=1600&auto=format&fit=crop",
    description: "Unwind on the shores of Rwanda's largest lake.",
  },
  {
    id: 5,
    title: "Kigali Cultural Tour",
    location: "Kigali City",
    image:
      "https://images.unsplash.com/photo-1489447068241-b3490214e879?q=90&w=1600&auto=format&fit=crop",
    description: "Vibrant markets, art galleries, and history.",
  },
];

export function ExperienceShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="container max-w-7xl mx-auto px-5 mb-12">
          <div className="max-w-2xl">
            <span className="block text-accent-warm uppercase tracking-widest text-xs font-bold mb-4">
              Curated Experiences
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase text-foreground leading-[0.9]">
              Journey Through
              <br />
              The Landscape
            </h2>
          </div>
        </div>

        <div className="w-full pl-5 md:pl-[max(2rem,calc((100vw-80rem)/2))]">
          <motion.div style={{ x }} className="flex gap-6 w-max">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="group relative h-[400px] w-[300px] md:h-[500px] md:w-[400px] shrink-0 overflow-hidden bg-muted rounded-sm cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              >
                <motion.div
                  className="w-full h-full relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    className="object-cover transition-transform duration-500"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="text-accent-warm text-xs uppercase tracking-widest font-bold block mb-2">
                    {experience.location}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase mb-4 leading-none">
                    {experience.title}
                  </h3>
                  <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                    <p className="text-white/80 line-clamp-3 mb-6 font-light text-sm leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                      {experience.description}
                    </p>
                    <button
                      type="button"
                      className="flex items-center gap-3 text-white text-xs uppercase tracking-widest font-bold transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Explore
                      <RiArrowRightLine size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
