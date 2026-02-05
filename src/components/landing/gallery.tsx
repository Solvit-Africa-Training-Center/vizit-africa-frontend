"use client";

import { RiArrowRightLine } from "@remixicon/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2600&auto=format&fit=crop",
    alt: "Imigongo Art",
    caption: "Cultural Heritage",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=2600&auto=format&fit=crop",
    alt: "Kigali Convention Center",
    caption: "Modern Kigali",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=2600&auto=format&fit=crop",
    alt: "Tea Plantation",
    caption: "Nyungwe Tea",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1628105658145-2b0444319808?q=80&w=2600&auto=format&fit=crop",
    alt: "Gorilla Trekking",
    caption: "Once in a Lifetime",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2600&auto=format&fit=crop",
    alt: "Safari Sunset",
    caption: "Golden Plains",
    className: "md:col-span-1 md:row-span-2",
  },
];

export function Gallery() {
  return (
    <section className="py-24 bg-background border-t border-border/50">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Captured Moments
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              See the world through the eyes of our travelers. From luxury stays
              to wild adventures.
            </p>
          </div>
          <Link href="/gallery">
            <Button variant="outline" className="gap-2 rounded-full px-6">
              View Full Gallery <RiArrowRightLine className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[800px]">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden bg-muted cursor-pointer ${img.className}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />

              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-white">
                <span className="text-xs font-mono uppercase tracking-widest mb-1 text-white/80">
                  {img.caption}
                </span>
                <span className="text-xl font-bold font-display leading-none">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
