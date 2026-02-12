"use client";

import { motion } from "motion/react";
import { RiMapPinLine, RiSuitcaseLine } from "@remixicon/react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const messages: Record<string, { heading: string; sub: string }> = {
  widget: {
    heading: "Let's find your flights",
    sub: "We've pre-filled your search details. Browse results below.",
  },
  destinations: {
    heading: "Great choice!",
    sub: "We've set your destination. Now let's build the perfect trip.",
  },
  services: {
    heading: "Browse our services",
    sub: "We've opened the section you're interested in.",
  },
  flights: {
    heading: "Nice pick!",
    sub: "Your flight is ready. Want to add a hotel or car?",
  },
  experiences: {
    heading: "Added to your notes",
    sub: "We've saved your interest. Build the rest of your trip below.",
  },
  gallery: {
    heading: "Inspired by Rwanda",
    sub: "We've noted what caught your eye. Let's plan your visit.",
  },
  direct: {
    heading: "Plan your trip",
    sub: "Build your perfect Rwanda itinerary step by step.",
  },
};

export function ContextBanner({ destination }: { destination?: string }) {
  const searchParams = useSearchParams();

  const source = useMemo(() => {
    if (searchParams.get("from") || searchParams.get("to")) return "widget";
    if (searchParams.get("destination")) return "destinations";
    if (searchParams.get("service")) return "services";
    if (searchParams.get("flight")) return "flights";
    if (searchParams.get("experience")) return "experiences";
    if (searchParams.get("note")) return "gallery";
    return "direct";
  }, [searchParams]);

  const msg = messages[source];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-muted/50 border border-border rounded-sm p-5 md:p-6 mb-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
          {source === "destinations" ? (
            <RiMapPinLine className="size-5 text-primary" />
          ) : (
            <RiSuitcaseLine className="size-5 text-primary" />
          )}
        </div>
        <div>
          <h2 className="font-display font-medium text-lg md:text-xl">
            {msg.heading}
            {destination && source === "destinations" && (
              <span className="text-primary"> {destination}</span>
            )}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{msg.sub}</p>
        </div>
      </div>
    </motion.div>
  );
}
