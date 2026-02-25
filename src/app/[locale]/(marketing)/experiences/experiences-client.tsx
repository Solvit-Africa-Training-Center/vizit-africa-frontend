"use client";

import { RiArrowDownLine } from "@remixicon/react";
import { AnimatePresence, motion, useInView } from "motion/react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { AddToTripButton } from "@/components/plan-trip/add-to-trip-button";
import { PageHeader } from "@/components/shared/page-header";
import { SaveButton } from "@/components/shared/save-button";
import { serviceSchema, type ServiceResponse } from "@/lib/unified-types";
import { cn } from "@/lib/utils";

interface ExperiencesClientProps {
  initialExperiences: ServiceResponse[];
}

const CATEGORY_MAPPING: Record<string, string> = {
  wildlife: "wildlifeNature",
  culture: "cultureLeisure",
  adventure: "adventure",
};

const CATEGORY_FALLBACK_IMAGES: Record<string, string[]> = {
  wildlifeNature: [
    "/images/wildlife-silverback-gorilla.jpg",
    "/images/buffaloes.jpg",
    "/images/elephant-with-guide.jpg",
    "/images/rhineceros.jpg",
  ],
  cultureLeisure: [
    "/images/girls-traditional-dancers-dancing-smiling.jpg",
    "/images/men-rwanda-traditional-dancers-dancing.jpg",
    "/images/city-kigali-roundabout-with-woman-and-child-statue.jpg",
    "/images/lake-kivu-sunset.jpg",
  ],
  adventure: [
    "/images/nyungwe-park.jpg",
    "/images/rwanda-bamboos.jpg",
    "/images/rwanda-walk-path-in-forest.jpg",
    "/images/road-through-hill.jpg",
  ],
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function ExperiencesClient({
  initialExperiences,
}: ExperiencesClientProps) {
  const t = useTranslations("Experiences");

  const experiences = useMemo(() => {
    const groups: Record<string, ServiceResponse[]> = {
      wildlifeNature: [],
      cultureLeisure: [],
      adventure: [],
    };

    initialExperiences.forEach((exp) => {
      const metaCategory = (exp.metadata?.category as string) || "adventure";
      const groupKey = CATEGORY_MAPPING[metaCategory] || "adventure";
      if (groups[groupKey]) {
        groups[groupKey].push(exp);
      }
    });

    return [
      {
        id: "wildlifeNature",
        category: t("categories.wildlifeNature"),
        items: groups.wildlifeNature,
      },
      {
        id: "cultureLeisure",
        category: t("categories.cultureLeisure"),
        items: groups.cultureLeisure,
      },
      {
        id: "adventure",
        category: t("categories.adventure"),
        items: groups.adventure,
      },
    ].filter((group) => group.items.length > 0);
  }, [initialExperiences, t]);

  const allExperiences = useMemo(
    () => experiences.flatMap((c) => c.items),
    [experiences],
  );

  const [activeId, setActiveId] = useState<string | number>(
    allExperiences.length > 0 ? allExperiences[0].id : "",
  );

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const getExperienceImage = (exp: ServiceResponse) => {
    const mediaImages = (exp.media || [])
      .filter((m) => m.media_type === "image" || !m.media_type)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((m) => m.media_url)
      .filter(Boolean);

    if (mediaImages.length > 0) {
      const mediaIdx = hashString(String(exp.id)) % mediaImages.length;
      return mediaImages[mediaIdx];
    }

    const metadataImageKeys = [
      "hero_image",
      "image",
      "coverImage",
      "thumbnail",
    ];
    for (const key of metadataImageKeys) {
      const value = exp.metadata?.[key];
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }

    const metaCategory = (exp.metadata?.category as string) || "adventure";
    const groupKey = CATEGORY_MAPPING[metaCategory] || "adventure";
    const pool =
      CATEGORY_FALLBACK_IMAGES[groupKey] || CATEGORY_FALLBACK_IMAGES.adventure;
    const fallbackIdx = hashString(`${exp.id}-${exp.title}`) % pool.length;
    return pool[fallbackIdx];
  };

  const getExperiencePrice = (exp: ServiceResponse) => {
    return typeof exp.base_price === "string"
      ? parseFloat(exp.base_price)
      : exp.base_price;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader
        title={t("title")}
        overline={t("overline")}
        layout="split"
        className="pt-24 md:pt-32 mb-0"
      >
        <div className="flex flex-col items-start md:items-end gap-3 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary mb-2 font-bold">
            Categories
          </span>
          {experiences.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="text-lg md:text-xl font-display font-medium uppercase tracking-tight text-muted-foreground/30 hover:text-foreground transition-all duration-300 hover:translate-x-2 md:hover:-translate-x-2 flex items-center gap-2 group"
            >
              {cat.category}
              <RiArrowDownLine className="size-4 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" />
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="relative flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 px-5 md:px-10 lg:pl-32 py-12 md:py-24 space-y-32 md:space-y-48">
          {experiences.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-16 md:mb-24">
                <span className="h-px bg-border flex-1" />
                <span className="font-display font-medium text-2xl uppercase text-muted-foreground/50">
                  {category.category}
                </span>
                <span className="h-px bg-border flex-1" />
              </div>

              <div className="space-y-32 md:space-y-48">
                {category.items.map((exp) => (
                  <ExperienceItem
                    key={String(exp.id)}
                    experience={exp}
                    isActive={activeId === exp.id}
                    onActivate={() => setActiveId(exp.id)}
                    labels={{
                      location: t("labels.location"),
                      duration: t("labels.duration"),
                      startingFrom: t("labels.startingFrom"),
                      requestQuote: t("labels.requestQuote"),
                    }}
                    getImage={getExperienceImage}
                    getPrice={getExperiencePrice}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="h-[20vh]" />
        </div>

        <div className="hidden md:block w-1/2 sticky top-0 h-screen overflow-hidden border-l border-border/40 bg-muted/20">
          <AnimatePresence mode="popLayout">
            {allExperiences.map(
              (exp) =>
                exp.id === activeId && (
                  <motion.div
                    key={String(exp.id)}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <NextImage
                      src={getExperienceImage(exp)}
                      alt={exp.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </motion.div>
                ),
            )}
          </AnimatePresence>

          <div className="absolute bottom-12 left-12 right-12 z-10 flex justify-between items-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={String(activeId)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary-foreground/60 text-xs font-mono uppercase tracking-widest">
                    0{allExperiences.findIndex((e) => e.id === activeId) + 1} /
                    0{allExperiences.length}
                  </span>
                  <span className="h-px w-12 bg-primary-foreground/20" />
                  <span className="text-primary-foreground text-sm font-medium uppercase tracking-widest">
                    {(allExperiences.find((e) => e.id === activeId)
                      ?.location as string) || "Rwanda"}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceItem({
  experience,
  isActive,
  onActivate,
  labels,
  getImage,
  getPrice,
}: {
  experience: ServiceResponse;
  isActive: boolean;
  onActivate: () => void;
  labels: {
    location: string;
    duration: string;
    startingFrom: string;
    requestQuote: string;
  };
  getImage: (exp: ServiceResponse) => string;
  getPrice: (exp: ServiceResponse) => number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      onActivate();
    }
  }, [isInView, onActivate]);

  const tags = (experience.metadata?.tags as string[]) || ["Experience"];
  const duration = (experience.metadata?.duration as string) || "Full Day";
  const location = (experience.location as string) || "Rwanda";
  const price = getPrice(experience);
  const image = getImage(experience);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-30 blur-xs",
      )}
    >
      <div className="mb-6 flex gap-3 flex-wrap">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="text-[10px] font-medium uppercase tracking-widest text-primary border border-primary/20 px-2 py-1 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2
        className={cn(
          "font-display font-medium uppercase leading-[0.85] mb-10 transition-all duration-500",
          "text-2xl md:text-4xl text-foreground",
        )}
      >
        {experience.title}
      </h2>

      <div className="md:hidden w-full h-80 relative mb-12 rounded-2xl overflow-hidden active-image-mobile">
        <NextImage
          src={image}
          alt={experience.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 border-y border-border/50 py-10">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
            {labels.location}
          </span>
          <span className="font-display font-medium text-lg uppercase tracking-tight">
            {location}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
            {labels.duration}
          </span>
          <span className="font-display font-medium text-lg uppercase tracking-tight">
            {duration}
          </span>
        </div>
        <div className="flex flex-col md:col-span-1 col-span-2">
          <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
            {labels.startingFrom}
          </span>
          <span className="font-display font-medium text-3xl text-primary tracking-tighter">
            ${price}
          </span>
        </div>
      </div>

      <p className="text-xl md:text-2xl font-light leading-relaxed text-muted-foreground mb-12 max-w-2xl">
        {experience.description}
      </p>

      <div className="flex items-center gap-6">
        <AddToTripButton
          type="experience"
          item={{
            id: String(experience.id),
            title: experience.title,
            description: experience.description,
            price: price,
            duration: duration,
            location: location,
            image: image,
          }}
          label={labels.requestQuote}
          variant="default"
          size="lg"
          className={cn(
            "rounded-full px-10 h-16 text-xs font-display uppercase tracking-widest transition-all duration-500 flex-1 md:flex-none md:min-w-[240px] shadow-lg",
            isActive
              ? "bg-primary text-primary-foreground shadow-primary/20 scale-105"
              : "bg-muted text-muted-foreground hover:bg-muted-foreground/10 shadow-none",
          )}
        />
        <SaveButton
          type="experience"
          id={String(experience.id)}
          variant="full"
          className={cn(
            "h-16 w-16 rounded-full p-0 flex items-center justify-center",
            !isActive && "opacity-50",
          )}
        />
      </div>
    </div>
  );
}
