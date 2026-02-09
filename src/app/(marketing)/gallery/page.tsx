"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { RiCloseLine, RiArrowRightLine } from "@remixicon/react";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { RevealText } from "@/components/ui/reveal-text";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { cn } from "@/lib/utils";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2600&auto=format&fit=crop",
    alt: "Imigongo Art",
    caption: "Cultural Heritage",
    category: "culture",
    aspect: "aspect-[3/4]",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=2600&auto=format&fit=crop",
    alt: "Kigali Convention Center",
    caption: "Modern Kigali",
    category: "urban",
    aspect: "aspect-[4/3]",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=2600&auto=format&fit=crop",
    alt: "Tea Plantation",
    caption: "Nyungwe Tea",
    category: "nature",
    aspect: "aspect-square",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1628105658145-2b0444319808?q=80&w=2600&auto=format&fit=crop",
    alt: "Gorilla Trekking",
    caption: "Once in a Lifetime",
    category: "wildlife",
    aspect: "aspect-[3/4]",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2600&auto=format&fit=crop",
    alt: "Safari Sunset",
    caption: "Golden Plains",
    category: "wildlife",
    aspect: "aspect-[16/9]",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=2600&auto=format&fit=crop",
    alt: "Canopy Walk",
    caption: "Above the Trees",
    category: "adventure",
    aspect: "aspect-[3/4]",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1565355866173-d5d140e69818?q=80&w=2600&auto=format&fit=crop",
    alt: "Lake Kivu",
    caption: "Serene Waters",
    category: "relax",
    aspect: "aspect-square",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2600&auto=format&fit=crop",
    alt: "Mount Bisoke",
    caption: "Volcanic Views",
    category: "adventure",
    aspect: "aspect-[4/3]",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1552423316-6950337c8651?q=80&w=2600&auto=format&fit=crop",
    alt: "Giraffes",
    caption: "Akagera Giants",
    category: "wildlife",
    aspect: "aspect-[3/5]",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1578323769534-7389c9df3ee0?q=80&w=2600&auto=format&fit=crop",
    alt: "Traditional Dance",
    caption: "Intore Dancers",
    category: "culture",
    aspect: "aspect-[4/3]",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1517260739337-6799d2ffdeee?q=80&w=2600&auto=format&fit=crop",
    alt: "Chimpanzee",
    caption: "Primate Cousins",
    category: "wildlife",
    aspect: "aspect-square",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1547823065-4c3f56846f43?q=80&w=2600&auto=format&fit=crop",
    alt: "Coffee Cherries",
    caption: "Rwanda's Gold",
    category: "culture",
    aspect: "aspect-[3/4]",
  },
];

const categories = [
  "all",
  "wildlife",
  "nature",
  "culture",
  "adventure",
  "relax",
  "urban",
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);

  const filteredImages =
    activeTab === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeTab);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-32 pb-24">
        {/* Stark Editorial Header */}
        <header className="px-5 md:px-10 max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                The Collection
              </span>
              <h1 className="font-display text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                <RevealText text="Visual Stories" />
              </h1>
              <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-lg leading-relaxed">
                A curated selection of moments captured across the Land of a
                Thousand Hills.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 min-w-[200px]">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                Filter By
              </span>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "text-lg md:text-xl font-display font-medium uppercase tracking-tight transition-all duration-300 hover:translate-x-2 md:hover:-translate-x-2",
                    activeTab === cat
                      ? "text-foreground"
                      : "text-muted-foreground/40 hover:text-foreground",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8 relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-sm">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2600&auto=format&fit=crop"
              alt="Feature"
              fill
              className="object-cover"
              containerClassName="w-full h-[120%]"
            />
          </div>
          <div className="md:col-span-4 flex flex-col justify-end pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Featured • Wildlife
            </span>
            <p className="font-display text-3xl md:text-4xl font-bold uppercase leading-none mb-4">
              Golden Plains of Akagera
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Where the savannah meets the sky. Witness the majestic Big Five in
              their natural habitat.
            </p>
          </div>
        </section>

        <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32">
          <motion.div
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.slice(0, 6).map((img, index) => (
                <GalleryItem
                  key={img.id}
                  img={img}
                  index={index}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* break */}
        <section className="w-full h-[80vh] relative flex items-center justify-center overflow-hidden mb-32">
          <div className="absolute inset-0 z-0">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1628105658145-2b0444319808?q=80&w=2600&auto=format&fit=crop"
              alt="Cinematic Break"
              fill
              className="object-cover brightness-50"
              containerClassName="w-full h-[120%]"
            />
          </div>
          <div className="relative z-10 max-w-4xl px-8 text-center">
            <span className="text-white/60 font-mono text-sm uppercase tracking-widest mb-6 block">
              Voices of Rwanda
            </span>
            <blockquote className="font-display text-4xl md:text-6xl text-white font-bold leading-tight mb-8">
              "In the heart of Africa, every landscape tells a story of
              resilience and beauty."
            </blockquote>
          </div>
        </section>

        <section className="px-5 md:px-10 max-w-7xl mx-auto">
          <motion.div
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.slice(6).map((img, index) => (
                <GalleryItem
                  key={img.id}
                  img={img}
                  index={index}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
      <Footer />

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-4 z-50 group"
              onClick={() => setSelectedImage(null)}
            >
              <RiCloseLine className="size-10 group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>

            <motion.div
              layoutId={`image-${selectedImage.id}`}
              className="relative w-full max-w-7xl max-h-[90vh] aspect-[16/9] md:aspect-auto h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-linear-to-t from-black/90 via-black/50 to-transparent">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-white/60 font-mono uppercase tracking-widest text-sm mb-2 block">
                      {selectedImage.category} • {selectedImage.caption}
                    </span>
                    <h2 className="text-white font-display text-4xl md:text-5xl font-bold uppercase">
                      {selectedImage.alt}
                    </h2>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GalleryItem({
  img,
  index,
  onClick,
}: {
  img: any;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-none break-inside-avoid cursor-pointer bg-muted",
        img.aspect,
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0">
        <ParallaxImage
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          containerClassName="w-full h-full"
        />
      </div>

      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent -z-10" />
        <span className="text-white/70 font-mono text-xs uppercase tracking-widest mb-1">
          {img.category}
        </span>
        <div className="flex items-center justify-between">
          <h3 className="text-white font-display text-2xl font-bold uppercase leading-none">
            {img.alt}
          </h3>
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
            <RiArrowRightLine className="size-5 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
