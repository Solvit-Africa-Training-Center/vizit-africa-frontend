"use client";

import { RiMagicLine, RiMapPinLine } from "@remixicon/react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { TripInfo } from "@/lib/plan_trip-types";

interface TripDetailsInputProps {
  tripInfo: TripInfo;
  updateTripInfo: (info: Partial<TripInfo>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function TripDetailsInput({
  tripInfo,
  updateTripInfo,
  onGenerate,
  isGenerating,
}: TripDetailsInputProps) {
  const t = useTranslations("PlanTrip");
  const today = new Date().toISOString().split("T")[0];

  const [_dateRange, setDateRange] = useState<DateRange | undefined>(
    tripInfo.departureDate && tripInfo.returnDate
      ? {
          from: new Date(tripInfo.departureDate),
          to: new Date(tripInfo.returnDate),
        }
      : undefined,
  );

  const validationFeedback = useMemo(() => {
    if (!tripInfo.destination) return "Please enter a destination.";
    if (!tripInfo.arrivalDate) return "Please select an arrival date.";
    if (!tripInfo.departureDate) return "Please select a departure date.";
    if (tripInfo.departureDate < tripInfo.arrivalDate)
      return "Departure must be on or after arrival.";
    if (tripInfo.isRoundTrip) {
      if (!tripInfo.returnDate) return "Please select a return date.";
      if (tripInfo.returnDate < tripInfo.departureDate)
        return "Return date must be on or after departure.";
    }
    return null;
  }, [tripInfo]);

  const isValid = !validationFeedback;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6 bg-card border border-border/50 p-6 rounded-xl shadow-xs"
    >
      <div className="text-center space-y-1">
        <h2 className="text-xl font-display font-medium uppercase tracking-wide">
          {t("tripDetails.heading")}
        </h2>
        <p className="text-muted-foreground text-xs">
          {t("tripDetails.subheading")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.whereTo")}
          </Label>
          <div className="relative">
            <RiMapPinLine className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder={t("tripDetails.wherePlaceholder")}
              value={tripInfo.destination || ""}
              onChange={(e) => updateTripInfo({ destination: e.target.value })}
              className="pl-9 h-10 text-sm bg-background/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.departingFrom")}
          </Label>
          <div className="relative">
            <RiMapPinLine className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder={t("tripDetails.departingPlaceholder")}
              value={tripInfo.departureCity || ""}
              onChange={(e) => updateTripInfo({ departureCity: e.target.value })}
              className="pl-9 h-10 text-sm bg-background/50"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("tripDetails.when")}
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                id="round-trip"
                checked={tripInfo.isRoundTrip}
                onCheckedChange={(val) => updateTripInfo({ isRoundTrip: val })}
              />
              <Label htmlFor="round-trip" className="text-xs">
                Round Trip
              </Label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground">
                {t("tripDetails.arrival")}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  min={today}
                  value={tripInfo.arrivalDate || ""}
                  onChange={(e) => updateTripInfo({ arrivalDate: e.target.value })}
                  className="h-10 text-xs bg-background/50 flex-1"
                />
                <Input
                  type="time"
                  value={tripInfo.arrivalTime || ""}
                  onChange={(e) => updateTripInfo({ arrivalTime: e.target.value })}
                  className="h-10 text-xs bg-background/50 w-24"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground">
                {t("tripDetails.departure")}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  min={tripInfo.arrivalDate || today}
                  value={tripInfo.departureDate || ""}
                  onChange={(e) =>
                    updateTripInfo({ departureDate: e.target.value })
                  }
                  className="h-10 text-xs bg-background/50 flex-1"
                />
                <Input
                  type="time"
                  value={tripInfo.departureTime || ""}
                  onChange={(e) =>
                    updateTripInfo({ departureTime: e.target.value })
                  }
                  className="h-10 text-xs bg-background/50 w-24"
                />
              </div>
            </div>

            {tripInfo.isRoundTrip && (
              <div className="space-y-1.5 sm:col-start-2">
                <Label className="text-[10px] text-muted-foreground">
                  Return to Origin
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    min={tripInfo.departureDate || today}
                    value={tripInfo.returnDate || ""}
                    onChange={(e) => updateTripInfo({ returnDate: e.target.value })}
                    className="h-10 text-xs bg-background/50 flex-1"
                  />
                  <Input
                    type="time"
                    value={tripInfo.returnTime || ""}
                    onChange={(e) =>
                      updateTripInfo({ returnTime: e.target.value })
                    }
                    className="h-10 text-xs bg-background/50 w-24"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.whosComing")}
          </Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground ml-1">
                {t("tripDetails.adults")}
              </Label>
              <NumberField
                min={1}
                value={tripInfo.adults ?? null}
                onValueChange={(val) =>
                  updateTripInfo({ adults: val ?? undefined })
                }
              >
                <NumberFieldGroup className="h-10 bg-background/50">
                  <NumberFieldDecrement />
                  <NumberFieldInput className="text-sm" />
                  <NumberFieldIncrement />
                </NumberFieldGroup>
              </NumberField>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground ml-1">
                {t("tripDetails.kids")}
              </Label>
              <NumberField
                min={0}
                value={tripInfo.children ?? null}
                onValueChange={(val) =>
                  updateTripInfo({ children: val ?? undefined })
                }
              >
                <NumberFieldGroup className="h-10 bg-background/50">
                  <NumberFieldDecrement />
                  <NumberFieldInput className="text-sm" />
                  <NumberFieldIncrement />
                </NumberFieldGroup>
              </NumberField>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground ml-1">
                Infants
              </Label>
              <NumberField
                min={0}
                value={tripInfo.infants ?? null}
                onValueChange={(val) =>
                  updateTripInfo({ infants: val ?? undefined })
                }
              >
                <NumberFieldGroup className="h-10 bg-background/50">
                  <NumberFieldDecrement />
                  <NumberFieldInput className="text-sm" />
                  <NumberFieldIncrement />
                </NumberFieldGroup>
              </NumberField>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Travel Preferences & Requirements
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-5 rounded-lg border border-border/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="need-flights"
                  checked={tripInfo.needsFlights}
                  onCheckedChange={(v) => updateTripInfo({ needsFlights: v })}
                />
                <Label htmlFor="need-flights" className="text-xs font-bold">
                  Flights
                </Label>
              </div>
              {tripInfo.needsFlights && (
                <div className="pl-8 space-y-2">
                  <Label className="text-[10px] text-muted-foreground block">
                    Preferred Cabin
                  </Label>
                  <Select
                    value={tripInfo.preferredCabinClass || ""}
                    onValueChange={(v: any) =>
                      updateTripInfo({ preferredCabinClass: v })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">
                        Premium Economy
                      </SelectItem>
                      <SelectItem value="business">Business Class</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="need-hotel"
                  checked={tripInfo.needsHotel}
                  onCheckedChange={(v) => updateTripInfo({ needsHotel: v })}
                />
                <Label htmlFor="need-hotel" className="text-xs font-bold">
                  Accommodation
                </Label>
              </div>
              {tripInfo.needsHotel && (
                <div className="pl-8 space-y-2">
                  <Label className="text-[10px] text-muted-foreground block">
                    Minimum Rating
                  </Label>
                  <Select
                    value={tripInfo.hotelStarRating || ""}
                    onValueChange={(v) => updateTripInfo({ hotelStarRating: v })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="any">Any verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="need-car"
                  checked={tripInfo.needsCar}
                  onCheckedChange={(v) => updateTripInfo({ needsCar: v })}
                />
                <Label htmlFor="need-car" className="text-xs font-bold">
                  Vehicle Rental
                </Label>
              </div>
              {tripInfo.needsCar && (
                <div className="pl-8 space-y-2">
                  <Label className="text-[10px] text-muted-foreground block">
                    Preferred Type
                  </Label>
                  <Select
                    value={tripInfo.carTypePreference || ""}
                    onValueChange={(v) => updateTripInfo({ carTypePreference: v })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4x4">Safari 4x4 / SUV</SelectItem>
                      <SelectItem value="sedan">Luxury Sedan</SelectItem>
                      <SelectItem value="van">Passenger Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="need-guide"
                  checked={tripInfo.needsGuide}
                  onCheckedChange={(v) => updateTripInfo({ needsGuide: v })}
                />
                <Label htmlFor="need-guide" className="text-xs font-bold">
                  Local Guide
                </Label>
              </div>
              {tripInfo.needsGuide && (
                <div className="pl-8 space-y-2">
                  <Label className="text-[10px] text-muted-foreground block">
                    Primary Language
                  </Label>
                  <Select
                    value={tripInfo.guideLanguages?.[0] || "English"}
                    onValueChange={(v) => updateTripInfo({ guideLanguages: v ? [v] : [] })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="Kinyarwanda">Kinyarwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.tripStyle")}
          </Label>
          <Select
            value={tripInfo.tripPurpose || ""}
            onValueChange={(val: any) => updateTripInfo({ tripPurpose: val })}
          >
            <SelectTrigger className="h-10 text-sm bg-background/50">
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

        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("tripDetails.specialWishes")}
          </Label>
          <Textarea
            placeholder={t("tripDetails.wishesPlaceholder")}
            value={tripInfo.specialRequests || ""}
            onChange={(e) => updateTripInfo({ specialRequests: e.target.value })}
            className="min-h-[80px] text-sm bg-background/50 resize-none"
          />
        </div>
      </div>

      {validationFeedback && (
        <p className="text-center text-[10px] text-destructive font-medium uppercase tracking-tight animate-in fade-in slide-in-from-top-1">
          {validationFeedback}
        </p>
      )}

      <div className="pt-2 flex justify-center">
        <Button
          size="lg"
          onClick={onGenerate}
          disabled={!isValid || isGenerating}
          className="h-11 px-8 text-sm font-display uppercase tracking-widest relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <RiMagicLine className="size-4" />
            {isGenerating
              ? t("tripDetails.generating")
              : t("tripDetails.generate")}
          </span>
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </Button>
      </div>
    </motion.div>
  );
}
