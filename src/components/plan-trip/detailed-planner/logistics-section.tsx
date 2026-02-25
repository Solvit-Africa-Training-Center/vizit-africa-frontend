"use client";

import { RiMapPinLine, RiPlaneLine, RiCalendarLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import type { TripInfo } from "@/lib/plan_trip-types";

interface LogisticsSectionProps {
  tripInfo: TripInfo;
  updateTripInfo: (info: Partial<TripInfo>) => void;
}

export function LogisticsSection({
  tripInfo,
  updateTripInfo,
}: LogisticsSectionProps) {
  const t = useTranslations("PlanTrip.detailedPlanner.sections.foundation");
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-bold border border-primary/20">
          {t("step")}
        </div>
        <h3 className="font-display text-2xl font-medium uppercase tracking-tight">
          {t("title")}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pl-14">
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            {t("destination")}
          </Label>
          <div className="relative">
            <RiMapPinLine className="absolute left-0 top-1/2 -translate-y-1/2 size-5 text-primary" />
            <input
              placeholder={t("destinationPlaceholder")}
              value={tripInfo.destination || ""}
              onChange={(e) => updateTripInfo({ destination: e.target.value })}
              className="w-full bg-transparent border-none pl-8 py-4 text-xl focus:ring-0 focus:outline-hidden placeholder:text-muted-foreground/20 font-light"
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-primary/40 to-transparent" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            {t("origin")}
          </Label>
          <div className="relative">
            <RiPlaneLine className="absolute left-0 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40" />
            <input
              placeholder={t("originPlaceholder")}
              value={tripInfo.departureCity || ""}
              onChange={(e) =>
                updateTripInfo({ departureCity: e.target.value })
              }
              className="w-full bg-transparent border-none pl-8 py-4 text-xl focus:ring-0 focus:outline-hidden placeholder:text-muted-foreground/20 font-light"
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <RiCalendarLine className="size-3" /> {t("arrival")}
          </Label>
          <div className="flex gap-2">
            <input
              type="date"
              min={today}
              value={tripInfo.arrivalDate || ""}
              onChange={(e) =>
                updateTripInfo({
                  arrivalDate: e.target.value,
                  startDate: e.target.value,
                })
              }
              className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:border-primary transition-colors"
            />
            <input
              type="time"
              value={tripInfo.arrivalTime || ""}
              onChange={(e) => updateTripInfo({ arrivalTime: e.target.value })}
              className="w-32 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <RiCalendarLine className="size-3" /> {t("departure")}
          </Label>
          <div className="flex gap-2">
            <input
              type="date"
              min={tripInfo.arrivalDate || today}
              value={tripInfo.departureDate || ""}
              onChange={(e) =>
                updateTripInfo({
                  departureDate: e.target.value,
                  endDate: e.target.value,
                })
              }
              className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:border-primary transition-colors"
            />
            <input
              type="time"
              value={tripInfo.departureTime || ""}
              onChange={(e) => updateTripInfo({ departureTime: e.target.value })}
              className="w-32 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
