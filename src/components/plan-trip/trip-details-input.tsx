"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  RiCalendarLine,
  RiMapPinLine,
  RiUserLine,
  RiMagicLine,
} from "@remixicon/react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TripInfo } from "@/lib/plan_trip-types";

interface TripDetailsInputProps {
  tripInfo: TripInfo;
  setTripInfo: (info: Partial<TripInfo>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function TripDetailsInput({
  tripInfo,
  setTripInfo,
  onGenerate,
  isGenerating,
}: TripDetailsInputProps) {
  const t = useTranslations("PlanTrip");

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    tripInfo.departureDate && tripInfo.returnDate
      ? {
          from: new Date(tripInfo.departureDate),
          to: new Date(tripInfo.returnDate),
        }
      : undefined,
  );

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setTripInfo({
        departureDate: format(range.from, "yyyy-MM-dd"),
      });
    }
    if (range?.to) {
      setTripInfo({
        returnDate: format(range.to, "yyyy-MM-dd"),
      });
    }
  };

  const isValid = !!(
    tripInfo.destination &&
    tripInfo.departureDate &&
    tripInfo.returnDate
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8 bg-card border border-border/50 p-8 rounded-xl shadow-xs"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-medium uppercase tracking-wide">
          {t("tripDetails.heading")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("tripDetails.subheading")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Destination */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.whereTo")}
          </Label>
          <div className="relative">
            <RiMapPinLine className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder={t("tripDetails.wherePlaceholder")}
              value={tripInfo.destination || ""}
              onChange={(e) => setTripInfo({ destination: e.target.value })}
              className="pl-9 h-12 bg-background/50"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.when")}
          </Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full h-12 justify-start items-center text-left font-normal bg-background/50",
                !dateRange && "text-muted-foreground",
              )}
            >
              <RiCalendarLine className="mr-2 size-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLO dd, y")} -{" "}
                    {format(dateRange.to, "LLO dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLO dd, y")
                )
              ) : (
                <span>{t("tripDetails.selectDates")}</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Travelers */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.whosComing")}
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <RiUserLine className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                placeholder={t("tripDetails.adults")}
                value={tripInfo.adults}
                onChange={(e) =>
                  setTripInfo({ adults: parseInt(e.target.value) || 0 })
                }
                className="pl-9 h-12 bg-background/50"
              />
            </div>
            <div className="relative flex-1">
              <RiUserLine className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                type="number"
                min={0}
                placeholder={t("tripDetails.kids")}
                value={tripInfo.children}
                onChange={(e) =>
                  setTripInfo({ children: parseInt(e.target.value) || 0 })
                }
                className="pl-9 h-12 bg-background/50"
              />
            </div>
          </div>
        </div>

        {/* Trip Purpose */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.tripStyle")}
          </Label>
          <Select
            value={tripInfo.tripPurpose}
            onValueChange={(val: any) => setTripInfo({ tripPurpose: val })}
          >
            <SelectTrigger className="h-12 bg-background/50">
              <SelectValue placeholder={t("tripDetails.selectStyle")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leisure">
                {t("tripDetails.purposes.leisure")}
              </SelectItem>
              <SelectItem value="adventure">
                {t("tripDetails.purposes.adventure")}
              </SelectItem>
              <SelectItem value="business">
                {t("tripDetails.purposes.business")}
              </SelectItem>
              <SelectItem value="family">
                {t("tripDetails.purposes.family")}
              </SelectItem>
              <SelectItem value="honeymoon">
                {t("tripDetails.purposes.honeymoon")}
              </SelectItem>
              <SelectItem value="cultural">
                {t("tripDetails.purposes.cultural")}
              </SelectItem>
              <SelectItem value="other">
                {t("tripDetails.purposes.other")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Special Requests */}
        <div className="md:col-span-2 space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.specialWishes")}
          </Label>
          <Textarea
            placeholder={t("tripDetails.wishesPlaceholder")}
            value={tripInfo.specialRequests}
            onChange={(e) => setTripInfo({ specialRequests: e.target.value })}
            className="min-h-[80px] bg-background/50 resize-none"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-center">
        <Button
          size="lg"
          onClick={onGenerate}
          disabled={!isValid || isGenerating}
          className="h-14 px-10 text-base font-display uppercase tracking-widest relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <RiMagicLine className="size-5" />
            {isGenerating
              ? t("tripDetails.generating")
              : t("tripDetails.generate")}
          </span>
          {/* Subtle shine effect */}
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </Button>
      </div>
    </motion.div>
  );
}
