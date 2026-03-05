"use client";

import {
  RiUser3Line,
  RiInformationLine,
  RiArrowRightLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type TripInfo, type TripItem } from "@/lib/plan_trip-types";
import { SERVICE_FEE_RATE } from "@/lib/configs";

interface TripSummaryCardProps {
  tripInfo: TripInfo;
  items: TripItem[];
  updateTripInfo: (info: Partial<TripInfo>) => void;
  onSubmit: () => void;
}

export function TripSummaryCard({
  tripInfo,
  items,
  updateTripInfo,
  onSubmit,
}: TripSummaryCardProps) {
  const t = useTranslations("PlanTrip.detailedPlanner.sections.identity");

  const itemsTotal = items.reduce((acc, item) => acc + (item.price || 0), 0);
  const serviceFee = Math.round(itemsTotal * SERVICE_FEE_RATE);
  const totalPrice = itemsTotal + serviceFee;

  return (
    <div className="bg-surface-ink text-white border border-primary/10 rounded-2xl md:rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden isolate space-y-6 sm:space-y-10">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,oklch(65%_0.06_245/0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl sm:text-2xl font-medium text-white uppercase tracking-tight">
            The Narrative
          </h3>
          <RiInformationLine className="size-5 sm:size-6 text-primary-light/40" />
        </div>

        {/* Guest Identity */}
        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
              {t("fullName")}
            </Label>
            <div className="relative group">
              <RiUser3Line className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary-light/40 transition-colors group-focus-within:text-primary-light" />
              <Input
                value={tripInfo.name || ""}
                onChange={(e) => updateTripInfo({ name: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 sm:h-12 pl-11 rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
                placeholder={t("fullNamePlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
                {t("email")}
              </Label>
              <Input
                type="email"
                value={tripInfo.email || ""}
                onChange={(e) => updateTripInfo({ email: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 sm:h-12 rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
                placeholder={t("emailPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
                {t("phone")}
              </Label>
              <Input
                type="tel"
                value={tripInfo.phoneNumber || ""}
                onChange={(e) => updateTripInfo({ phoneNumber: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 sm:h-12 rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
                placeholder={t("phonePlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Collection Summary */}
        <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              {t("servicesSelected", { count: items.length })}
            </span>
            <span className="text-[10px] font-mono text-primary-light">
              Ref: {Math.random().toString(36).substring(7).toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-4 py-1"
              >
                <span className="text-xs text-white/70 truncate">
                  {item.title}
                </span>
                <span className="text-xs font-mono text-primary-light shrink-0">
                  ${item.price?.toLocaleString()}
                </span>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-xs text-white/30 italic py-2">
                No items added yet...
              </p>
            )}
          </div>
        </div>

        {/* Final Trigger */}
        <div className="pt-6 border-t border-white/10 space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {t("estimatedValue")}
              </p>
              <p className="font-display text-3xl sm:text-4xl font-medium text-primary-light">
                ${totalPrice.toLocaleString()}
              </p>
            </div>
            <p className="text-[9px] sm:text-[10px] text-primary-light/60 italic text-right max-w-[120px] leading-tight">
              {t("disclaimer")}
            </p>
          </div>

          <Button
            onClick={onSubmit}
            size="lg"
            className="w-full rounded-full h-14 sm:h-16 text-[10px] sm:text-xs uppercase tracking-widest font-sans font-semibold bg-primary hover:bg-primary/90 text-white border-0 shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105 group"
          >
            <span className="flex items-center gap-2">
              {t("submit")}
              <RiArrowRightLine className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
