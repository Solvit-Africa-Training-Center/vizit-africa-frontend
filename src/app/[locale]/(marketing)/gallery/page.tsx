"use client";

import Image from "next/image";
import { useState } from "react";
import { RiCloseLine, RiArrowRightLine } from "@remixicon/react";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { motion, AnimatePresence } from "motion/react";
import { RevealText } from "@/components/ui/reveal-text";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function GalleryPage() {
  const t = useTranslations("Gallery");
  const tCategories = useTranslations("Gallery.categories");

  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.1.alt"),
      caption: t("items.1.caption"),
      category: tCategories("culture"),
      aspect: "aspect-[3/4]",
      rawCategory: "culture",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.2.alt"),
      caption: t("items.2.caption"),
      category: tCategories("urban"),
      aspect: "aspect-[4/3]",
      rawCategory: "urban",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.3.alt"),
      caption: t("items.3.caption"),
      category: tCategories("nature"),
      aspect: "aspect-square",
      rawCategory: "nature",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1628105658145-2b0444319808?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.4.alt"),
      caption: t("items.4.caption"),
      category: tCategories("wildlife"),
      aspect: "aspect-[3/4]",
      rawCategory: "wildlife",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.5.alt"),
      caption: t("items.5.caption"),
      category: tCategories("wildlife"),
      aspect: "aspect-[16/9]",
      rawCategory: "wildlife",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.6.alt"),
      caption: t("items.6.caption"),
      category: tCategories("adventure"),
      aspect: "aspect-[3/4]",
      rawCategory: "adventure",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.7.alt"),
      caption: t("items.7.caption"),
      category: tCategories("relax"),
      aspect: "aspect-square",
      rawCategory: "relax",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.8.alt"),
      caption: t("items.8.caption"),
      category: tCategories("adventure"),
      aspect: "aspect-[4/3]",
      rawCategory: "adventure",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.9.alt"),
      caption: t("items.9.caption"),
      category: tCategories("wildlife"),
      aspect: "aspect-[3/5]",
      rawCategory: "wildlife",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1578323769534-7389c9df3ee0?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.10.alt"),
      caption: t("items.10.caption"),
      category: tCategories("culture"),
      aspect: "aspect-[4/3]",
      rawCategory: "culture",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1517260739337-6799d2ffdeee?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.11.alt"),
      caption: t("items.11.caption"),
      category: tCategories("wildlife"),
      aspect: "aspect-square",
      rawCategory: "wildlife",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1547823065-4c3f56846f43?q=80&w=2600&auto=format&fit=crop",
      alt: t("items.12.alt"),
      caption: t("items.12.caption"),
      category: tCategories("culture"),
      aspect: "aspect-[3/4]",
      rawCategory: "culture",
    },
  ];

  const categories = [
    { label: t("categories.all"), value: "all" },
    { label: t("categories.wildlife"), value: "wildlife" },
    { label: t("categories.nature"), value: "nature" },
    { label: t("categories.culture"), value: "culture" },
    { label: t("categories.adventure"), value: "adventure" },
    { label: t("categories.relax"), value: "relax" },
    { label: t("categories.urban"), value: "urban" },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);

  const filteredImages =
    activeTab === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.rawCategory === activeTab);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-32 pb-24">
        <header className="px-5 md:px-10 max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                {t("overline")}
              </span>
              <h1 className="font-display text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                <RevealText text={t("title")} />
              </h1>
              <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-lg leading-relaxed">
                {t("description")}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 min-w-[200px]">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                {t("filterBy")}
              </span>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setActiveTab(cat.value)}
                  className={cn(
                    "text-lg md:text-xl font-display font-medium uppercase tracking-tight transition-all duration-300 hover:translate-x-2 md:hover:-translate-x-2",
                    activeTab === cat.value
                      ? "text-foreground"
                      : "text-muted-foreground/40 hover:text-foreground",
                  )}
                >
                  {cat.label}
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
              {t("featured.overline")}
            </span>
            <p className="font-display text-3xl md:text-4xl font-bold uppercase leading-none mb-4">
              {t("featured.title")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("featured.description")}
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
            <span className="text-foreground/60 font-mono text-sm uppercase tracking-widest mb-6 block">
              {t("quote.overline")}
            </span>
            <blockquote className="font-display text-4xl md:text-6xl font-bold leading-tight mb-8">
              "{t("quote.text")}"
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
