"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { RevealText } from "@/components/ui/reveal-text";
import { Magnetic } from "@/components/ui/magnetic";
import {
  RiTimeLine,
  RiMapPinLine,
  RiArrowRightLine,
  RiStarFill,
  RiArrowDownLine,
} from "@remixicon/react";
import Link from "next/link";
import NextImage from "next/image";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const experiences = [
  {
    category: "Wildlife & Nature",
    items: [
      {
        id: "gorilla-trekking",
        title: "Gorilla Trekking",
        location: "Volcanoes National Park",
        duration: "1 Packaged Day",
        price: 1500,
        rating: 5.0,
        reviews: 124,
        image:
          "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2600&auto=format&fit=crop",
        description:
          "A once-in-a-lifetime encounter with the majestic mountain gorillas in their natural habitat. Trek through the misty forests of the Virunga volcanoes.",
        tags: ["Adventure", "Wildlife", "Physical"],
      },
      {
        id: "akagera-safari",
        title: "Akagera Game Drive",
        location: "Akagera National Park",
        duration: "2 Days / 1 Night",
        price: 450,
        rating: 4.9,
        reviews: 92,
        image:
          "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2600&auto=format&fit=crop",
        description:
          "Spot the Big Five (Lions, Leopards, Rhinos, Elephants, Buffalos) in Rwanda's only savannah park. Enjoy boat trips on Lake Ihema.",
        tags: ["Wildlife", "Safari", "Nature"],
      },
      {
        id: "nyungwe-canopy",
        title: "Canopy Walk & Chimps",
        location: "Nyungwe Forest",
        duration: "2 Days",
        price: 200,
        rating: 4.7,
        reviews: 64,
        image:
          "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=2600&auto=format&fit=crop",
        description:
          "Walk 60 meters above the forest floor on the famous canopy walkway and track chimpanzees in one of Africa's oldest rainforests.",
        tags: ["Adventure", "Nature", "Hiking"],
      },
    ],
  },
  {
    category: "Culture & Leisure",
    items: [
      {
        id: "kigali-city-tour",
        title: "Kigali Cultural Tour",
        location: "Kigali City",
        duration: "Full Day",
        price: 80,
        rating: 4.8,
        reviews: 85,
        image:
          "https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=2600&auto=format&fit=crop",
        description:
          "Explore the vibrant heart of Rwanda. Visit the Kigali Genocide Memorial, Kimironko Market, and art galleries to understand the country's past and present.",
        tags: ["Culture", "History", "Urban"],
      },
      {
        id: "lake-kivu-relax",
        title: "Lake Kivu Retreat",
        location: "Rubavu / Karongi",
        duration: "3 Days",
        price: 350,
        rating: 4.8,
        reviews: 45,
        image:
          "https://images.unsplash.com/photo-1565355866173-d5d140e69818?q=80&w=2600&auto=format&fit=crop",
        description:
          "Unwind on the sandy shores of Lake Kivu. Enjoy boat rides, coffee tours, and stunning sunsets at this beautiful rift valley lake.",
        tags: ["Relaxation", "Water", "Leisure"],
      },
    ],
  },
  {
    category: "Adventure",
    items: [
      {
        id: "bisoke-hike",
        title: "Mount Bisoke Hike",
        location: "Musanze",
        duration: "1 Day",
        price: 75,
        rating: 4.6,
        reviews: 38,
        image:
          "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2600&auto=format&fit=crop",
        description:
          "Challenging but rewarding hike to the summit of Mount Bisoke, featuring a beautiful crater lake at the top.",
        tags: ["Hiking", "Adventure", "Physical"],
      },
    ],
  },
];

const allExperiences = experiences.flatMap((c) => c.items);

export default function ExperiencesPage() {
  const [activeId, setActiveId] = useState(allExperiences[0].id);

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground">
        <header className="pt-32 pb-8 px-5 md:px-10 max-w-7xl mx-auto border-b border-border/40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                The Catalog
              </span>
              <h1 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tight leading-[0.9]">
                <RevealText text="Curated Experiences" />
              </h1>
            </div>

            {/* nav */}
            <div className="flex flex-wrap gap-4 mb-2">
              {experiences.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => scrollToCategory(cat.category)}
                  className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  {cat.category}
                  <RiArrowDownLine className="size-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="relative flex flex-col md:flex-row">
          {/* left: scroll */}
          <div className="w-full md:w-1/2 px-5 md:px-10 py-12 md:py-24 space-y-32 md:space-y-48">
            {experiences.map((category) => (
              <div
                key={category.category}
                id={category.category}
                className="scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-16 md:mb-24">
                  <span className="h-px bg-border flex-1" />
                  <span className="font-display font-bold text-2xl uppercase text-muted-foreground/50">
                    {category.category}
                  </span>
                  <span className="h-px bg-border flex-1" />
                </div>

                <div className="space-y-32 md:space-y-48">
                  {category.items.map((exp) => (
                    <ExperienceItem
                      key={exp.id}
                      experience={exp}
                      isActive={activeId === exp.id}
                      onActivate={() => setActiveId(exp.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="h-[20vh]" />
          </div>

          <div className="hidden md:block w-1/2 sticky top-0 h-screen overflow-hidden border-l border-border/40 bg-muted/20">
            <AnimatePresence mode="popLayout">
              {allExperiences.map(
                (exp) =>
                  exp.id === activeId && (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <NextImage
                        src={exp.image}
                        alt={exp.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </motion.div>
                  ),
              )}
            </AnimatePresence>

            <div className="absolute bottom-12 left-12 right-12 z-10 flex justify-between items-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                      0{allExperiences.findIndex((e) => e.id === activeId) + 1}{" "}
                      / 0{allExperiences.length}
                    </span>
                    <span className="h-px w-12 bg-white/20" />
                    <span className="text-white text-sm font-bold uppercase tracking-widest">
                      {allExperiences.find((e) => e.id === activeId)?.location}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function ExperienceItem({
  experience,
  isActive,
  onActivate,
}: {
  experience: (typeof allExperiences)[0];
  isActive: boolean;
  onActivate: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      onActivate();
    }
  }, [isInView, onActivate]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-30 blur-xs",
      )}
    >
      <div className="mb-6 flex gap-3 flex-wrap">
        {experience.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 px-2 py-1 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2
        className={cn(
          "font-display font-bold uppercase leading-[0.85] mb-10 transition-all duration-500",
          isActive
            ? "text-5xl md:text-7xl text-foreground"
            : "text-4xl md:text-5xl text-muted-foreground",
        )}
      >
        {experience.title}
      </h2>

      <div className="md:hidden w-full h-64 relative mb-8 rounded-2xl overflow-hidden active-image-mobile">
        <NextImage
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 border-y border-border/50 py-6">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-2">
            Location
          </span>
          <span className="font-medium text-sm md:text-base">
            {experience.location}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-2">
            Duration
          </span>
          <span className="font-medium text-sm md:text-base">
            {experience.duration}
          </span>
        </div>
        <div className="flex flex-col md:col-span-1 col-span-2">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-2">
            Starting From
          </span>
          <span className="font-display font-bold text-xl text-primary">
            ${experience.price}
          </span>
        </div>
      </div>

      <p className="text-lg md:text-xl font-light leading-relaxed text-muted-foreground mb-10 max-w-xl">
        {experience.description}
      </p>

      <Link href={`/plan-trip?experience=${experience.id}`}>
        <Magnetic>
          <Button
            size="lg"
            className={cn(
              "rounded-xl px-8 h-14 text-base transition-all duration-300 group",
              isActive
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted-foreground/10",
            )}
          >
            Request Quote{" "}
            <RiArrowRightLine className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Magnetic>
      </Link>
    </div>
  );
}
