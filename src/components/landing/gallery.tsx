"use client";

import { RiArrowRightLine } from "@remixicon/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { AddToTripButton } from "@/components/plan-trip/add-to-trip-button";
import { Button } from "@/components/ui/button";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Link } from "@/i18n/navigation";
import { GALLERY_IMAGES } from "@/lib/configs";
import { SectionTitle } from "./section-title";

export function Gallery() {
  const t = useTranslations("LandingGallery");
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
          overline={t("overline")}
          title={
            <span className="whitespace-pre-line block">{t("title")}</span>
          }
          description={t("description")}
          className="max-w-2xl mb-0"
        />
        <Link href="/gallery">
          <Button variant="outline" className="rounded-lg px-6">
            {t("viewAll")} <RiArrowRightLine />
          </Button>
        </Link>
      </div>

      <div className="container max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div style={{ y: y1 }} className="flex flex-col gap-6 md:mt-12">
          {GALLERY_IMAGES.slice(0, 2).map((img) => (
            <GalleryCard key={img.id} img={img} className="aspect-square" />
          ))}
        </motion.div>

        <motion.div style={{ y: y2 }} className="flex flex-col gap-6">
          {GALLERY_IMAGES.slice(2, 4).map((img) => (
            <GalleryCard key={img.id} img={img} className="aspect-4/3" />
          ))}
        </motion.div>

        <motion.div style={{ y: y3 }} className="flex flex-col gap-6 md:mt-24">
          {GALLERY_IMAGES.slice(4, 6).map((img) => (
            <GalleryCard key={img.id} img={img} className="aspect-square" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface GalleryImage {
  id: string;
  src: string;
}

// ... (GalleryCard function)

function GalleryCard({
  img,
  className,
}: {
  img: GalleryImage;
  className?: string;
}) {
  const t = useTranslations("LandingGallery");

  return (
    <div
      className={`block relative group overflow-hidden rounded-2xl cursor-pointer ${className}`}
    >
      <ParallaxImage
        src={img.src}
        alt={t(`items.${img.id}.alt`)}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        loading="lazy"
        containerClassName="w-full h-full"
        imageClassName="transition-transform duration-300 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-200" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-primary-foreground/80 font-mono text-xs uppercase tracking-widest mb-1">
          {t(`items.${img.id}.caption`)}
        </p>
        <h3 className="text-primary-foreground font-display text-xl font-medium mb-3">
          {t(`items.${img.id}.alt`)}
        </h3>
        <AddToTripButton
          type="note"
          note={`Gallery: ${t(`items.${img.id}.alt`)} - ${t(`items.${img.id}.caption`)}`}
          label="Add to Trip"
          size="sm"
          className="w-fit"
        />
      </div>
    </div>
  );
}
