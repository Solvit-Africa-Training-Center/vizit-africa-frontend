"use client";

import { RiArrowRightLine } from "@remixicon/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { SectionTitle } from "./section-title";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1629299342279-aa4b29356913?q=90&w=1600&auto=format&fit=crop",
    alt: "Imigongo Art",
    caption: "Cultural Heritage",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1648708511872-5426c0f29c27?q=90&w=1600&auto=format&fit=crop",
    alt: "Kigali Convention Center",
    caption: "Modern Kigali",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1602020277972-99978250c8bd?q=90&w=1600&auto=format&fit=crop",
    alt: "Tea Plantation",
    caption: "Nyungwe Tea",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1676102818778-7dedb5cdad46?q=90&w=1600&auto=format&fit=crop",
    alt: "Gorilla Trekking",
    caption: "Once in a Lifetime",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1516465675917-6856496ffa3d?q=90&w=1600&auto=format&fit=crop",
    alt: "Safari Sunset",
    caption: "Golden Plains",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1756245995172-3d2d50219fb1?q=90&w=1600&auto=format&fit=crop",
    alt: "Canopy Walk",
    caption: "Above the Trees",
  },
];

export function Gallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-32 bg-muted/30 overflow-hidden"
    >
      <div className="container max-w-7xl mx-auto px-5 md:px-10 mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
        <SectionTitle
          overline="Visual Stories"
          title={
            <>
              Captured <br />
              Moments
            </>
          }
          description="See the world through the eyes of our travelers. From luxury stays to wild adventures."
          className="max-w-2xl mb-0"
        />
        <Link href="/gallery">
          <Button variant="outline" className="rounded-lg px-6">
            View Full Gallery <RiArrowRightLine />
          </Button>
        </Link>
      </div>

      <div className="container max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div style={{ y: y1 }} className="flex flex-col gap-6 md:mt-12">
          {galleryImages.slice(0, 2).map((img) => (
            <GalleryCard key={img.id} img={img} className="aspect-square" />
          ))}
        </motion.div>

        <motion.div style={{ y: y2 }} className="flex flex-col gap-6">
          {galleryImages.slice(2, 4).map((img) => (
            <GalleryCard key={img.id} img={img} className="aspect-[4/3]" />
          ))}
        </motion.div>

        <motion.div style={{ y: y3 }} className="flex flex-col gap-6 md:mt-24">
          {galleryImages.slice(4, 6).map((img) => (
            <GalleryCard key={img.id} img={img} className="aspect-square" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

function GalleryCard({
  img,
  className,
}: {
  img: GalleryImage;
  className?: string;
}) {
  return (
    <div
      className={`relative group overflow-hidden rounded-2xl cursor-pointer ${className}`}
    >
      <ParallaxImage
        src={img.src}
        alt={img.alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        loading="lazy"
        containerClassName="w-full h-full"
        imageClassName="transition-transform duration-300 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-200" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-white/80 font-mono text-xs uppercase tracking-widest mb-1">
          {img.caption}
        </p>
        <h3 className="text-white font-display text-xl font-bold">{img.alt}</h3>
      </div>
    </div>
  );
}
