"use client";

import type { Car } from "../../lib/plan_trip-types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  RiCarLine,
  RiUserLine,
  RiSettings4Line,
  RiCheckLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";

interface CarCardProps {
  car: Car;
  isSelected: boolean;
  days: number;
  withDriver: boolean;
  driverSurcharge: number;
  onSelect: () => void;
  onDriverChange: (withDriver: boolean) => void;
}

export function CarCard({
  car,
  isSelected,
  days,
  withDriver,
  driverSurcharge,
  onSelect,
  onDriverChange,
}: CarCardProps) {
  const baseTotal = car.pricePerDay * days;
  const driverTotal = driverSurcharge * days;
  const total = baseTotal + (isSelected && withDriver ? driverTotal : 0);

  const tSummary = useTranslations("PlanTrip.summary");
  const tFeatures = useTranslations("PlanTrip.data.features");
  const tAttributes = useTranslations("PlanTrip.data.carAttributes");
  const tTypes = useTranslations("PlanTrip.data.carTypes");

  return (
    <div
      onClick={onSelect}
      className={`group relative border transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-primary-foreground hover:border-primary"
      }`}
    >
      <div
        className={`absolute top-0 right-0 p-3 z-10 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0"}`}
      >
        <div className="size-6 bg-primary text-primary-foreground flex items-center justify-center">
          <RiCheckLine className="size-4" />
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="aspect-4/3 bg-muted relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <RiCarLine className="size-12 text-muted-foreground/30" />
          </div>
          <div className="absolute top-0 left-0 bg-primary-foreground/90 backdrop-blur-sm px-4 py-2 border-b border-r border-border">
            <span className="text-xs font-mono uppercase tracking-widest">
              {tTypes(car.category as any)}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1 gap-4">
          <div>
            <h4 className="font-display text-xl font-medium uppercase tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors">
              {car.model}
            </h4>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <RiUserLine className="size-3.5" />
                {car.seats}
              </span>
              <span className="w-px h-3 bg-border" />
              <span className="flex items-center gap-1.5">
                <RiSettings4Line className="size-3.5" />
                {tAttributes(car.transmission as any)}
              </span>
              <span className="w-px h-3 bg-border" />
              <span>{tAttributes(car.fuelType as any)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {car.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[10px] uppercase tracking-wider px-2 py-1 border border-border text-muted-foreground"
              >
                {tFeatures(f as any)}
              </span>
            ))}
          </div>

          {isSelected && (
            <div
              className="bg-background border border-border p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <RadioGroup
                value={withDriver ? "with" : "self"}
                onValueChange={(v) => onDriverChange(v === "with")}
                className="gap-3"
              >
                <div className="flex items-center justify-between group/option cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="self"
                      id={`self-${car.id}`}
                      className="border-muted-foreground text-primary"
                    />
                    <Label
                      htmlFor={`self-${car.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      Self-drive
                    </Label>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    ${car.pricePerDay}
                    <span className="text-xs">{tSummary("perDay")}</span>
                  </span>
                </div>

                <div className="w-full h-px bg-border/50" />

                <div className="flex items-center justify-between group/option cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="with"
                      id={`with-${car.id}`}
                      className="border-muted-foreground text-primary"
                    />
                    <Label
                      htmlFor={`with-${car.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      With driver
                    </Label>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    ${car.pricePerDay + driverSurcharge}
                    <span className="text-xs">{tSummary("perDay")}</span>
                  </span>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-border/50 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Est. Total ({days} {tSummary("days")})
              </p>
              <p className="font-display text-xl font-medium text-foreground">
                ${total}*
              </p>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              ${car.pricePerDay}
              <span className="text-xs font-light">{tSummary("perDay")}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
