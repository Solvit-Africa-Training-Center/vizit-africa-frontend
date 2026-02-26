"use client";

import {
  RiPlaneLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/components/ui/number-field";
import type { TripInfo } from "@/lib/plan_trip-types";

interface PreferencesSectionProps {
  tripInfo: TripInfo;
  updateTripInfo: (info: Partial<TripInfo>) => void;
}

export function PreferencesSection({
  tripInfo,
  updateTripInfo,
}: PreferencesSectionProps) {
  const tCuration = useTranslations("PlanTrip.detailedPlanner.sections.curation");
  const tPurpose = useTranslations("PlanTrip.detailedPlanner.sections.purpose");
  const tDetails = useTranslations("PlanTrip.tripDetails");

  return (
    <div className="space-y-12">
      {/* Personalized Curation */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-bold border border-primary/20">
            {tCuration("step")}
          </div>
          <h3 className="font-display text-2xl font-medium uppercase tracking-tight">
            {tCuration("title")}
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 pl-14">
          <div className="p-5 rounded-2xl border border-border/50 bg-muted/10 space-y-4 transition-all hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiPlaneLine className="size-5 text-primary" />
                <Label className="text-xs font-bold uppercase tracking-wider">
                  {tCuration("flights")}
                </Label>
              </div>
              <Switch
                checked={tripInfo.needsFlights}
                onCheckedChange={(v) => updateTripInfo({ needsFlights: v })}
              />
            </div>
            {tripInfo.needsFlights && (
              <Select
                value={tripInfo.preferredCabinClass || ""}
                onValueChange={(v: any) =>
                  updateTripInfo({ preferredCabinClass: v })
                }
              >
                <SelectTrigger className="h-10 bg-background border-border/50 text-xs">
                  <SelectValue placeholder={tCuration("cabinClassPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">{tCuration("cabinClassOptions.economy")}</SelectItem>
                  <SelectItem value="business">{tCuration("cabinClassOptions.business")}</SelectItem>
                  <SelectItem value="first">{tCuration("cabinClassOptions.first")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-border/50 bg-muted/10 space-y-4 transition-all hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiHotelLine className="size-5 text-primary" />
                <Label className="text-xs font-bold uppercase tracking-wider">
                  {tCuration("accommodation")}
                </Label>
              </div>
              <Switch
                checked={tripInfo.needsHotel}
                onCheckedChange={(v) => updateTripInfo({ needsHotel: v })}
              />
            </div>
            {tripInfo.needsHotel && (
              <Select
                value={tripInfo.hotelStarRating || ""}
                onValueChange={(v) => updateTripInfo({ hotelStarRating: v })}
              >
                <SelectTrigger className="h-10 bg-background border-border/50 text-xs">
                  <SelectValue placeholder={tCuration("starRatingPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">{tCuration("starRatingOptions.3")}</SelectItem>
                  <SelectItem value="4">{tCuration("starRatingOptions.4")}</SelectItem>
                  <SelectItem value="5">{tCuration("starRatingOptions.5")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-border/50 bg-muted/10 space-y-4 transition-all hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiCarLine className="size-5 text-primary" />
                <Label className="text-xs font-bold uppercase tracking-wider">
                  {tCuration("transport")}
                </Label>
              </div>
              <Switch
                checked={tripInfo.needsCar}
                onCheckedChange={(v) => updateTripInfo({ needsCar: v })}
              />
            </div>
            {tripInfo.needsCar && (
              <Select
                value={tripInfo.carTypePreference || ""}
                onValueChange={(v) => updateTripInfo({ carTypePreference: v })}
              >
                <SelectTrigger className="h-10 bg-background border-border/50 text-xs">
                  <SelectValue placeholder={tCuration("preferredVehiclePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">{tCuration("vehicleOptions.sedan")}</SelectItem>
                  <SelectItem value="4x4">{tCuration("vehicleOptions.4x4")}</SelectItem>
                  <SelectItem value="van">{tCuration("vehicleOptions.van")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-border/50 bg-muted/10 space-y-4 transition-all hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiUserStarLine className="size-5 text-primary" />
                <Label className="text-xs font-bold uppercase tracking-wider">
                  {tCuration("localGuide")}
                </Label>
              </div>
              <Switch
                checked={tripInfo.needsGuide}
                onCheckedChange={(v) => updateTripInfo({ needsGuide: v })}
              />
            </div>
                                {tripInfo.needsGuide && (
                                  <Select
                                    value={tripInfo.guideLanguages?.[0] || ""}
                                    onValueChange={(v) => updateTripInfo({ guideLanguages: v ? [v] : [] })}
                                  >
                                    <SelectTrigger className="h-10 bg-background border-border/50 text-xs">
                                      <SelectValue placeholder={tCuration("primaryLanguagePlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="English">{tCuration("languageOptions.English")}</SelectItem>
                                      <SelectItem value="French">{tCuration("languageOptions.French")}</SelectItem>
                                      <SelectItem value="German">{tCuration("languageOptions.German")}</SelectItem>
                                      <SelectItem value="Spanish">{tCuration("languageOptions.Spanish")}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </div>
                          </section>
            
                          {/* Party & Purpose */}
                          <section className="space-y-8">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-bold border border-primary/20">
                                {tPurpose("step")}
                              </div>
                              <h3 className="font-display text-2xl font-medium uppercase tracking-tight">
                                {tPurpose("title")}
                              </h3>
                            </div>
            
                            <div className="grid md:grid-cols-2 gap-12 pl-14">
                              <div className="space-y-4">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                                  {tPurpose("travelers")}
                                </Label>
                                <div className="grid grid-cols-3 gap-4">
                                  {["adults", "children", "infants"].map((key) => (
                                    <div key={key} className="space-y-1.5">
                                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                        {tDetails(key)}
                                      </p>
                                      <NumberField
                                        min={key === "adults" ? 1 : 0}
                                        value={(tripInfo as any)[key] ?? 0}
                                        onValueChange={(val) => updateTripInfo({ [key]: val ?? 0 })}
                                      >
                                        <NumberFieldGroup className="h-10 bg-muted/20 border-border/50">
                                          <NumberFieldInput className="text-sm font-medium" />
                                        </NumberFieldGroup>
                                      </NumberField>
                                    </div>
                                  ))}
                                </div>
                              </div>
            
                              <div className="space-y-4">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                                  {tPurpose("tripStyle")}
                                </Label>
                                <Select
                                  value={tripInfo.tripPurpose || ""}
                                  onValueChange={(v) => updateTripInfo({ tripPurpose: v ?? undefined })}
                                >
                                  <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50 text-sm">
                                    <SelectValue placeholder={tPurpose("vibePlaceholder")} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="leisure">{tPurpose("tripStyleOptions.leisure")}</SelectItem>
                                    <SelectItem value="adventure">{tPurpose("tripStyleOptions.adventure")}</SelectItem>
                                    <SelectItem value="business">{tPurpose("tripStyleOptions.business")}</SelectItem>
                                    <SelectItem value="cultural">{tPurpose("tripStyleOptions.cultural")}</SelectItem>
                                    <SelectItem value="honeymoon">{tPurpose("tripStyleOptions.honeymoon")}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </section>
                        </div>
                      );
                    }
