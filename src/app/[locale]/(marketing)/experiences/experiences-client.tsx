"use client";

import { RiArrowDownLine } from "@remixicon/react";
import NextImage from "next/image";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { AddToTripButton } from "@/components/plan-trip/add-to-trip-button";
import { SaveButton } from "@/components/shared/save-button";
import type { ServiceResponse } from "@/lib/schema/service-schema";

interface ExperiencesClientProps {
  initialExperiences: ServiceResponse[];
}

interface ExperienceCategory {
  id: string;
  category: string;
  items: ServiceResponse[];
}

const CATEGORY_MAPPING: Record<string, string> = {
  wildlife: "wildlifeNature",
  culture: "cultureLeisure",
  adventure: "adventure",
};

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
    if (exp.media && exp.media.length > 0) return exp.media[0].media_url;
    return "/images/rwanda-landscape.jpg";
  };

  const getExperiencePrice = (exp: ServiceResponse) => {
    return typeof exp.base_price === "string"
      ? parseFloat(exp.base_price)
      : exp.base_price;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 md:pt-32">
      <PageHeader
        title={t("title")}
        overline={t("overline")}
        layout="split"
        className="border-b border-border/40 pb-8"
      >
        <div className="flex flex-wrap gap-4 mb-2">
          {experiences.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
            >
              {cat.category}
              <RiArrowDownLine className="size-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="relative flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 px-5 md:px-10 py-12 md:py-24 space-y-32 md:space-y-48">
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

      <div className="md:hidden w-full h-64 relative mb-8 rounded-2xl overflow-hidden active-image-mobile">
        <NextImage
          src={image}
          alt={experience.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 border-y border-border/50 py-6">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-2">
            {labels.location}
          </span>
          <span className="font-medium text-sm md:text-base">{location}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-2">
            {labels.duration}
          </span>
          <span className="font-medium text-sm md:text-base">{duration}</span>
        </div>
        <div className="flex flex-col md:col-span-1 col-span-2">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-2">
            {labels.startingFrom}
          </span>
          <span className="font-display font-medium text-xl text-primary">
            ${price}
          </span>
        </div>
      </div>

      <p className="text-lg md:text-xl font-light leading-relaxed text-muted-foreground mb-10 max-w-xl">
        {experience.description}
      </p>

      <div className="flex items-center gap-4">
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
            "rounded-xl px-8 h-14 text-base transition-all duration-300 flex-1",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted-foreground/10",
          )}
        />
        <SaveButton
          type="experience"
          id={String(experience.id)}
          variant="full"
          className={cn("h-14 rounded-xl px-6", !isActive && "opacity-50")}
        />
      </div>
    </div>
  );
}
