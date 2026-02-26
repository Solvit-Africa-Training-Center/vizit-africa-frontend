"use client";

import {
  RiUser3Line,
  RiInformationLine,
  RiArrowRightLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TripInfo, TripItem } from "@/lib/plan_trip-types";

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
  const totalPrice = items.reduce((acc, i) => acc + (i.price || 0), 0);

  return (
    <div className="bg-surface-ink text-white border border-primary/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden isolate space-y-10">
      {/* Glow Effect */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,oklch(65%_0.06_245/0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-medium text-white">
            {t("title")}
          </h3>
          <div className="size-10 rounded-xl bg-primary-light/10 flex items-center justify-center text-primary-light">
            <RiUser3Line className="size-5" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
              {t("fullName")}
            </Label>
            <Input
              value={tripInfo.name}
              onChange={(e) => updateTripInfo({ name: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 text-base rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
              placeholder={t("fullNamePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
              {t("email")}
            </Label>
            <Input
              type="email"
              value={tripInfo.email || ""}
              onChange={(e) => updateTripInfo({ email: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 text-base rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
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
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 text-base rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
              placeholder={t("phonePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
              {t("budget")}
            </Label>
            <Select
              value={tripInfo.budgetBracket || "mid-range"}
              onValueChange={(v) =>
                updateTripInfo({ budgetBracket: v ?? undefined })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl text-sm focus:ring-primary-light/50">
                <SelectValue placeholder={t("budgetPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">{t("budgetOptions.value")}</SelectItem>
                <SelectItem value="mid-range">
                  {t("budgetOptions.midRange")}
                </SelectItem>
                <SelectItem value="luxury">
                  {t("budgetOptions.luxury")}
                </SelectItem>
                <SelectItem value="ultra-luxe">
                  {t("budgetOptions.ultraLuxe")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
              {t("specialNarrative")}
            </Label>
            <Textarea
              value={tripInfo.specialRequests || ""}
              onChange={(e) =>
                updateTripInfo({
                  specialRequests: e.target.value,
                })
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[120px] text-sm rounded-2xl resize-none p-4 font-light leading-relaxed focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
              placeholder={t("specialNarrativePlaceholder")}
            />
          </div>
        </div>

        <Separator className="opacity-20 bg-white" />

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {t("estimatedValue")}
              </p>
              <p className="font-display text-3xl font-medium text-primary-light">
                ${totalPrice.toLocaleString()}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="font-mono py-1 px-3 bg-white/10 text-white hover:bg-white/20 border-0"
            >
              {t("servicesSelected", { count: items.length })}
            </Badge>
          </div>
          <div className="p-4 rounded-2xl bg-primary-light/10 border border-primary-light/20 flex gap-3">
            <RiInformationLine className="size-4 text-primary-light shrink-0 mt-0.5" />
            <p className="text-[10px] text-primary-light/80 leading-normal italic">
              {t("disclaimer")}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onSubmit}
          className="w-full rounded-full h-16 text-xs uppercase tracking-widest font-sans font-semibold bg-primary hover:bg-primary/90 text-white border-0 shadow-xl shadow-primary/20 group relative overflow-hidden transition-all duration-300 hover:scale-105"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {t("submit")}
            <RiArrowRightLine className="size-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </div>
    </div>
  );
}
