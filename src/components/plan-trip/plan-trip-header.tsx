"use client";

import { RevealText } from "@/components/ui/reveal-text";

interface PlanTripHeaderProps {
  title: string;
  subtitle?: string;
}

export function PlanTripHeader({ title, subtitle }: PlanTripHeaderProps) {
  return (
    <div className="mb-8 md:mb-12 text-center">
      <RevealText
        text={title}
        className="font-display text-4xl md:text-6xl font-medium uppercase text-foreground mb-4 justify-center"
        delay={0.1}
      />
      {subtitle && (
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}
