"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import {
  RiTimeLine,
  RiMapPinLine,
  RiArrowRightLine,
  RiStarFill,
} from "@remixicon/react";
import Link from "next/link";
import NextImage from "next/image";
import { motion } from "motion/react";

const experiences = [
  {
    id: "gorilla-trekking",
    title: "Gorilla Trekking",
    location: "Volcanoes National Park",
    duration: "1 Packaged Day (often 2-3 days trip)",
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
];

export default function ExperiencesPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <NextImage
              src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=90&w=2600&auto=format&fit=crop"
              alt="Gorilla"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-white/80 font-mono uppercase tracking-widest text-sm md:text-base mb-4 block">
                Discover Rwanda
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
                Curated Experiences
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                From the misty mountains of the Virungas to the savannahs of
                Akagera, choose your next great adventure.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-5 md:px-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full"
              >
                <div className="h-64 bg-muted relative overflow-hidden">
                  <NextImage
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <RiMapPinLine className="size-4" /> {exp.location}
                    </span>
                    <div className="flex items-center gap-1 text-accent-warm text-sm font-bold">
                      <RiStarFill className="size-4" />
                      {exp.rating}{" "}
                      <span className="text-muted-foreground font-normal">
                        ({exp.reviews})
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {exp.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-foreground font-medium mb-6">
                    <RiTimeLine className="size-4 text-primary" />
                    {exp.duration}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Starting from
                      </span>
                      <span className="text-lg font-bold text-primary">
                        ${exp.price}
                      </span>
                    </div>
                    <Link href={`/plan-trip?experience=${exp.id}`}>
                      <Button>
                        Book Now <RiArrowRightLine />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
