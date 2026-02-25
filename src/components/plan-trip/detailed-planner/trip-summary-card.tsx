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
    <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-primary/5 space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-medium">{t("title")}</h3>
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <RiUser3Line className="size-5" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">
              {t("fullName")}
            </Label>
            <Input
              value={tripInfo.name}
              onChange={(e) => updateTripInfo({ name: e.target.value })}
              className="bg-muted/20 border-border/40 h-12 text-base rounded-xl"
              placeholder={t("fullNamePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">
              {t("email")}
            </Label>
            <Input
              type="email"
              value={tripInfo.email || ""}
              onChange={(e) => updateTripInfo({ email: e.target.value })}
              className="bg-muted/20 border-border/40 h-12 text-base rounded-xl"
              placeholder={t("emailPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">
              {t("budget")}
            </Label>
            <Select
              value={tripInfo.budgetBracket || "mid-range"}
              onValueChange={(v) => updateTripInfo({ budgetBracket: v ?? undefined })}
            >
              <SelectTrigger className="bg-muted/20 border-border/40 h-12 rounded-xl text-sm">
                <SelectValue placeholder={t("budgetPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">Value (Budget Conscious)</SelectItem>
                <SelectItem value="mid-range">
                  Mid-Range (Quality & Comfort)
                </SelectItem>
                <SelectItem value="luxury">Luxury (High-end Excellence)</SelectItem>
                <SelectItem value="ultra-luxe">
                  Ultra-Luxury (The Finest Only)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">
              {t("specialNarrative")}
            </Label>
            <Textarea
              value={tripInfo.specialRequests || ""}
              onChange={(e) =>
                updateTripInfo({
                  specialRequests: e.target.value,
                })
              }
              className="bg-muted/20 border-border/40 min-h-[120px] text-sm rounded-2xl resize-none p-4 font-light leading-relaxed"
              placeholder={t("specialNarrativePlaceholder")}
            />
          </div>
        </div>

        <Separator className="opacity-50" />

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {t("estimatedValue")}
              </p>
              <p className="font-display text-3xl font-medium text-primary">
                ${totalPrice.toLocaleString()}
              </p>
            </div>
            <Badge variant="secondary" className="font-mono py-1 px-3">
              {t("servicesSelected", { count: items.length })}
            </Badge>
          </div>
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3">
            <RiInformationLine className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal italic">
              {t("disclaimer")}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onSubmit}
          className="w-full rounded-full h-16 text-lg font-bold shadow-xl shadow-primary/20 group relative overflow-hidden"
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
