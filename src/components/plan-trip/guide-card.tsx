"use client";

import type { Guide } from "../../lib/plan_trip-types";
import { RiUserStarLine, RiCheckLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

interface GuideCardProps {
  guide: Guide;
  isSelected: boolean;
  onToggle: () => void;
}

export function GuideCard({ guide, isSelected, onToggle }: GuideCardProps) {
  const tTypes = useTranslations("PlanTrip.data.guideTypes");

  return (
    <div
      onClick={onToggle}
      className={`group relative border transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-primary-foreground hover:border-primary"
      }`}
    >
      <div
        className={`absolute top-0 right-0 p-3 z-10 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0"}`}
      >
        <div className="size-6 bg-primary text-primary-foreground flex items-center justify-center">
          <RiCheckLine className="size-4" />
        </div>
      </div>

      <div className="p-6 flex items-start gap-5">
        <div className="size-16 bg-muted flex items-center justify-center shrink-0 border border-border relative overflow-hidden">
          <RiUserStarLine className="size-8 text-muted-foreground/50" />
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 className="font-display text-lg font-medium uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                {tTypes(guide.id as any)}
              </h4>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {guide.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {guide.languages.map((lang) => (
              <span
                key={lang}
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-border text-muted-foreground"
              >
                {lang}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Daily Rate
            </span>
            <p className="font-display text-xl font-medium text-foreground">
              ${guide.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
