"use client";

import { RiArrowDownLine } from "@remixicon/react";
import { AnimatePresence, motion, useInView } from "motion/react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { AddToTripButton } from "@/components/plan-trip/add-to-trip-button";
import { PageHeader } from "@/components/shared/page-header";
import { SaveButton } from "@/components/shared/save-button";
import { type ServiceResponse } from "@/lib/unified-types";
import { cn, IMAGE_PLACEHOLDER } from "@/lib/utils";

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
      if (groups[groupKey]) groups[groupKey].push(exp);
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
    ].filter((g) => g.items.length > 0);
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
    if (element)
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
  };

  const getExperienceImage = (exp: ServiceResponse) => {
    const mediaImages = (exp.media || [])
      .map((m: any) => {
        if (typeof m === "string") return m;
        if (typeof m === "object" && m !== null && m.media_url)
          return m.media_url;
        return null;
      })
      .filter((url): url is string => typeof url === "string" && !!url);

    if (mediaImages.length > 0)
      return mediaImages[hashString(String(exp.id)) % mediaImages.length];

    for (const key of ["hero_image", "image", "coverImage", "thumbnail"]) {
      const value = exp.metadata?.[key];
      if (typeof value === "string" && value.trim()) return value;
    }

    const metaCategory = (exp.metadata?.category as string) || "adventure";
    const groupKey = CATEGORY_MAPPING[metaCategory] || "adventure";
    const pool =
      CATEGORY_FALLBACK_IMAGES[groupKey] || CATEGORY_FALLBACK_IMAGES.adventure;

    if (!pool || pool.length === 0) return IMAGE_PLACEHOLDER;

    return pool[hashString(`${exp.id}-${exp.title}`) % pool.length];
  };

  const getExperiencePrice = (exp: ServiceResponse) =>
    typeof exp.basePrice === "string"
      ? parseFloat(exp.basePrice)
      : exp.basePrice;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Page header — split layout, category nav on right ── */}
      <PageHeader
        title={t("title")}
        overline={t("overline")}
        layout="split"
        className="pt-24 md:pt-32 mb-0"
      >
        <div className="flex flex-col items-start md:items-end gap-2.5 mb-1">
          {/* Category label — primary per design guide */}
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary mb-1">
            {t("categoriesTitle")}
          </span>
          {experiences.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={[
                "text-lg md:text-xl font-display font-light uppercase tracking-tight",
                "text-muted-foreground/30 hover:text-foreground",
                "transition-all duration-300 hover:translate-x-2 md:hover:-translate-x-2",
                "flex items-center gap-2 group",
              ].join(" ")}
            >
              {cat.category}
              <RiArrowDownLine className="size-4 opacity-0 -translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400" />
            </button>
          ))}
        </div>
      </PageHeader>

      {/* ── Split scroll layout ── */}
      <div className="relative flex flex-col md:flex-row">
        {/* Left: scrollable content */}
        <div className="w-full md:w-1/2 px-5 md:px-10 lg:pl-32 py-12 md:py-16 space-y-20 md:space-y-32">
          {experiences.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-28">
              {/* Category divider */}
              <div className="flex items-center gap-4 mb-16 md:mb-20">
                <span className="h-px bg-border flex-1" />
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary">
                  {category.category}
                </span>
                <span className="h-px bg-border flex-1" />
              </div>

              <div className="space-y-20 md:space-y-32">
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
          <div className="h-[10vh]" />
        </div>

        {/* Right: sticky image panel */}
        <div className="hidden md:block w-1/2 sticky top-0 h-screen overflow-hidden border-l border-border/40 bg-surface-bone">
          <AnimatePresence mode="popLayout">
            {allExperiences.map(
              (exp) =>
                exp.id === activeId && (
                  <motion.div
                    key={String(exp.id)}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
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

          {/* Active experience metadata overlay */}
          <div className="absolute bottom-10 left-10 right-10 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={String(activeId)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex items-end justify-between"
              >
                <div className="flex flex-col gap-1.5">
                  {/* Amber overline — counter */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary-foreground/70">
                      {String(
                        allExperiences.findIndex((e) => e.id === activeId) + 1,
                      ).padStart(2, "0")}
                      &nbsp;/&nbsp;
                      {String(allExperiences.length).padStart(2, "0")}
                    </span>
                    <span className="h-px w-8 bg-primary-light/30" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
                      {(allExperiences.find((e) => e.id === activeId)
                        ?.location as string) || "Rwanda"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ExperienceItem ───────────────────────────────────────────────
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
  const t = useTranslations("Experiences");
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) onActivate();
  }, [isInView, onActivate]);

  const tags = (experience.metadata?.tags as string[]) || [t("fallbacks.tag")];
  const duration =
    (experience.metadata?.duration as string) || t("fallbacks.duration");
  const location = (experience.location as string) || t("fallbacks.location");
  const price = getPrice(experience);
  const image = getImage(experience);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-600",
        isActive ? "opacity-100" : "opacity-25 blur-[1px]",
      )}
    >
      {/* Tags — primary border per design guide */}
      <div className="mb-5 flex gap-2 flex-wrap">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary border border-primary/25 px-2.5 py-1 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h2 className="font-display font-light uppercase tracking-tight leading-[0.9] mb-9 text-2xl md:text-4xl text-foreground">
        {experience.title}
      </h2>

      {/* Mobile image */}
      <div className="md:hidden w-full h-72 relative mb-10 rounded-2xl overflow-hidden">
        <NextImage
          src={image}
          alt={experience.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 border-y border-border/50 py-8">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {labels.location}
          </span>
          <span className="font-display font-light text-lg uppercase tracking-tight">
            {location}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {labels.duration}
          </span>
          <span className="font-display font-light text-lg uppercase tracking-tight">
            {duration}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {labels.startingFrom}
          </span>
          {/* Price — primary per design guide */}
          <span className="font-display font-light text-3xl text-primary tracking-tighter">
            ${price}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xl md:text-2xl font-light leading-relaxed text-muted-foreground mb-10 max-w-2xl">
        {experience.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-5">
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
            "rounded-full px-10 h-14 text-[11px] font-sans font-medium uppercase tracking-widest",
            "flex-1 md:flex-none md:min-w-[220px]",
            "transition-all duration-500",
            isActive
              ? "bg-primary text-primary-foreground shadow-[0_8px_24px_oklch(42%_0.06_245/0.2)] scale-100"
              : "bg-muted text-muted-foreground hover:bg-muted-foreground/10 shadow-none scale-95",
          )}
        />
        <SaveButton
          type="experience"
          id={String(experience.id)}
          variant="full"
          className={cn(
            "h-14 w-14 rounded-full p-0 flex items-center justify-center border border-border/60",
            !isActive && "opacity-40",
          )}
        />
      </div>
    </div>
  );
}
