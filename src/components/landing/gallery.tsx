"use client";

import { galleryImages } from "@/lib/dummy-data";
import { RiArrowRightLine, RiZoomInLine } from "@remixicon/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Gallery() {
  // Show only first 6 images for preview
  const previewImages = galleryImages.slice(0, 6);

  return (
    <section className="py-20 bg-white border-t border-border">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Traveler Gallery
            </h2>
            <p className="text-muted-foreground">
              See the world through the eyes of our travelers. From luxury stays
              to wild adventures.
            </p>
          </div>
          <Link href="/gallery">
            <Button variant="outline" className="gap-2">
              View Full Gallery <RiArrowRightLine className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {previewImages.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xl bg-muted aspect-[4/3] cursor-pointer"
            >
              <div className="w-full h-full bg-neutral-200">
                {/* Placeholder */}
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                  {img.alt}
                </div>
              </div>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  View in Gallery
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
