"use client";

import Image from "next/image";

import { useState } from "react";
import { RiCloseLine, RiZoomInLine, RiFilter3Line } from "@remixicon/react";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { motion, AnimatePresence } from "motion/react";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2600&auto=format&fit=crop",
    alt: "Imigongo Art",
    caption: "Cultural Heritage",
    category: "culture",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=2600&auto=format&fit=crop",
    alt: "Kigali Convention Center",
    caption: "Modern Kigali",
    category: "urban",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=2600&auto=format&fit=crop",
    alt: "Tea Plantation",
    caption: "Nyungwe Tea",
    category: "nature",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1628105658145-2b0444319808?q=80&w=2600&auto=format&fit=crop",
    alt: "Gorilla Trekking",
    caption: "Once in a Lifetime",
    category: "wildlife",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2600&auto=format&fit=crop",
    alt: "Safari Sunset",
    caption: "Golden Plains",
    category: "wildlife",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=2600&auto=format&fit=crop",
    alt: "Canopy Walk",
    caption: "Above the Trees",
    category: "adventure",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1565355866173-d5d140e69818?q=80&w=2600&auto=format&fit=crop",
    alt: "Lake Kivu",
    caption: "Serene Waters",
    category: "relax",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2600&auto=format&fit=crop",
    alt: "Mount Bisoke",
    caption: "Volcanic Views",
    category: "adventure",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1552423316-6950337c8651?q=80&w=2600&auto=format&fit=crop",
    alt: "Giraffes",
    caption: "Akagera Giants",
    category: "wildlife",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1578323769534-7389c9df3ee0?q=80&w=2600&auto=format&fit=crop",
    alt: "Traditional Dance",
    caption: "Intore Dancers",
    category: "culture",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1517260739337-6799d2ffdeee?q=80&w=2600&auto=format&fit=crop",
    alt: "Chimpanzee",
    caption: "Primate Cousins",
    category: "wildlife",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1547823065-4c3f56846f43?q=80&w=2600&auto=format&fit=crop",
    alt: "Coffee Cherries",
    caption: "Rwanda's Gold",
    category: "culture",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1580060092265-d6d744235e16?q=80&w=2600&auto=format&fit=crop",
    alt: "Kigali Night",
    caption: "City Lights",
    category: "urban",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1623126860341-35c60205c08c?q=80&w=2600&auto=format&fit=crop",
    alt: "Twin Lakes",
    caption: "Burera & Ruhondo",
    category: "nature",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1544468625-2a2ec06f5053?q=80&w=2600&auto=format&fit=crop",
    alt: "Zebras",
    caption: "Striped Beauty",
    category: "wildlife",
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages =
    activeTab === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeTab);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=90&w=2600&auto=format&fit=crop"
              alt="Rwanda Gallery"
              fill
              className="object-cover"
              priority
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
                Visual Journey
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
                Our Gallery
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                Explore the beauty of Rwanda through our lens. From the misty
                mountains to the vibrant city life.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-16 z-30">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-2 mr-4 text-muted-foreground hidden md:flex">
                <RiFilter3Line className="size-5" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              {categories.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-primary text-white scale-105"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-5 md:px-10 max-w-7xl mx-auto min-h-[50vh]">
          <motion.div
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ duration: 0.4 }}
                  key={img.id}
                  className="group relative overflow-hidden rounded-2xl bg-muted break-inside-avoid cursor-pointer transition-all duration-500"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <div className="w-full relative aspect-4/3">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <RiZoomInLine className="size-6 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <p className="text-white text-lg font-bold font-display">
                      {img.caption}
                    </p>
                    <p className="text-white/80 text-xs font-mono uppercase tracking-widest mt-1">
                      {img.alt}
                    </p>
                  </div>
                </motion.div>
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
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full z-50"
              onClick={() => setSelectedImage(null)}
            >
              <RiCloseLine className="size-8" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl w-full max-h-[90vh] aspect-video rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Full size preview"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
