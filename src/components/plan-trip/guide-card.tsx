"use client";

import type { Guide } from "../../lib/plan_trip-types";
import { Badge } from "@/components/ui/badge";
import { RiUserStarLine, RiCheckLine } from "@remixicon/react";

interface GuideCardProps {
  guide: Guide;
  isSelected: boolean;
  onToggle: () => void;
}

export function GuideCard({ guide, isSelected, onToggle }: GuideCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`group relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary-subtle"
          : "border-border bg-white hover:border-primary/50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <RiUserStarLine className="size-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-foreground">{guide.type}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {guide.description}
              </p>
            </div>

            {isSelected && (
              <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <RiCheckLine className="size-4" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {guide.languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>

          <p className="font-bold text-lg text-foreground">${guide.price}</p>
        </div>
      </div>
    </div>
  );
}
