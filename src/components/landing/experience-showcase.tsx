"use client";

import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";

const experiences = [
  {
    id: 1,
    title: "Gorilla Trekking",
    location: "Volcanoes National Park",
    image: "/images/experiences/gorillas.jpg",
    description:
      "Face-to-face encounters with endangered mountain gorillas in their natural habitat.",
    colSpan: "md:col-span-2",
  },
  {
    id: 2,
    title: "Kigali Culture",
    location: "Kigali City",
    image: "/images/experiences/kigali.jpg",
    description:
      "Explore the vibrant art scene, markets, and history of Africa's cleanest city.",
    colSpan: "md:col-span-1",
  },
  {
    id: 3,
    title: "Lake Kivu Relaxation",
    location: "Western Province",
    image: "/images/experiences/lake-kivu.jpg",
    description:
      "Unwind on the sandy shores of Rwanda's largest lake with stunning sunsets.",
    colSpan: "md:col-span-1",
  },
  {
    id: 4,
    title: "Safari Adventure",
    location: "Akagera National Park",
    image: "/images/experiences/safari.jpg",
    description:
      "Spot the Big Five (lions, leopards, rhinos, elephants, buffalos) on a game drive.",
    colSpan: "md:col-span-2",
  },
];

export function ExperienceShowcase() {
  return (
    <section className="py-20 bg-neutral-50 border-t border-border">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Unforgettable Experiences
            </h2>
            <p className="text-muted-foreground text-lg">
              Rwanda offers more than just destinations; it offers moments that
              change you. Discover the magic waiting for you.
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" className="gap-2">
              View All Experiences <RiArrowRightLine className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className={`group relative overflow-hidden rounded-2xl h-[400px] ${exp.colSpan}`}
            >
              <div className="absolute inset-0 bg-neutral-800">
                {/* Placeholder for image */}
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                  Image: {exp.title}
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />

              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-accent-warm font-medium bg-accent-warm/10 text-xs px-2 py-1 rounded w-fit mb-2 backdrop-blur-sm">
                  {exp.location}
                </p>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  {exp.title}
                </h3>
                <p className="text-white/80 line-clamp-2 md:line-clamp-none opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
