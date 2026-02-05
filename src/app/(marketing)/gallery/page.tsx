"use client";

import { galleryImages } from "@/lib/dummy-data";
import { useState } from "react";
import { RiCloseLine, RiZoomInLine, RiFilter3Line } from "@remixicon/react";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "hotels" | "transport" | "experiences"
  >("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages =
    activeTab === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeTab);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-50 pt-20">
        <section className="bg-primary-subtle py-16 md:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-5 md:px-10 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Gallery
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the beauty of Rwanda through our lens. From the misty
              mountains to the vibrant city life.
            </p>
          </div>
        </section>

        <section className="py-8 border-b border-border bg-white sticky top-16 z-10 shadow-sm">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-2 mr-4 text-muted-foreground">
                <RiFilter3Line className="size-5" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              {["all", "hotels", "transport", "experiences"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-5 md:px-10 max-w-7xl mx-auto min-h-[50vh]">
          <motion.div
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={img.id}
                  className="group relative overflow-hidden rounded-xl bg-muted break-inside-avoid cursor-pointer shadow-sm hover:shadow-xl transition-all"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <div className="aspect-[4/3] w-full bg-neutral-200 relative">
                    {/* Placeholder */}
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium bg-neutral-200">
                      {img.alt}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <RiZoomInLine className="size-8 text-white scale-75 group-hover:scale-100 transition-transform" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">
                      {img.caption}
                    </p>
                    <p className="text-white/70 text-xs capitalize mt-1">
                      {img.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
      <Footer />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors bg-white/10 p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <RiCloseLine className="size-8" />
          </button>
          <div
            className="relative max-w-6xl w-full max-h-[90vh] aspect-video bg-neutral-900 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-medium">
              Full size image: {selectedImage}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
