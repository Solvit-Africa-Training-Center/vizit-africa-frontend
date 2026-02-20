"use client";

import type { TripItem, TripInfo } from "../../lib/plan_trip-types";
import { RiCheckLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

interface BookingSummaryProps {
  currentStep: number;
  tripInfo: TripInfo;
  items: TripItem[];
  days: number;
  travelers: number;
  driverSurcharge: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export function BookingSummary({
  currentStep,
  tripInfo,
  items,
  days,
  travelers,
  driverSurcharge,
  subtotal,
  serviceFee,
  total,
}: BookingSummaryProps) {
  const t = useTranslations("PlanTrip.summary");
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const flight = items.find((i) => i.type === "flight");
  const hotel = items.find((i) => i.type === "hotel");
  const car = items.find((i) => i.type === "car");
  const guide = items.find((i) => i.type === "guide");

  return (
    <div className="bg-muted/30 rounded-xl p-6 space-y-6">
      <h3 className="font-display text-lg font-medium text-foreground">
        {t("title")}
      </h3>

      {currentStep >= 3 ? (
        <>
          <div className="text-sm space-y-2 pb-4 border-b border-border">
            {tripInfo?.destination && (
              <div className="flex justify-between pb-2 mb-2 border-b border-border/50 border-dashed">
                <span className="text-muted-foreground">
                  {t("destination")}
                </span>
                <span className="font-medium">{tripInfo.destination}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("days")}</span>
              <span className="font-medium">
                {days} {t("days")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("travelers")}</span>
              <span className="font-medium">
                {travelers}{" "}
                {tripInfo.infants
                  ? `(+${tripInfo.infants} infant${tripInfo.infants > 1 ? "s" : ""})`
                  : ""}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <SummaryItem
              label={t("flight")}
              subLabel={
                flight
                  ? tripInfo.returnDate
                    ? t("roundTrip")
                    : t("oneWay")
                  : undefined
              }
              isSelected={!!flight}
              value={
                flight && flight.id !== "requested"
                  ? (flight.price || 0) * travelers
                  : null
              }
              status={flight?.id === "requested" ? "pending" : undefined}
            />
            <SummaryItem
              label={t("accommodation")}
              isSelected={!!hotel}
              value={
                hotel?.data?.pricePerNight
                  ? hotel.data.pricePerNight * days
                  : null
              }
            />
            <SummaryItem
              label={t("vehicle")}
              isSelected={!!car}
              value={
                car?.data?.pricePerDay
                  ? car.data.pricePerDay * days +
                    (car.data.withDriver ? driverSurcharge * days : 0)
                  : null
              }
            />
            <SummaryItem
              label={t("guide")}
              isSelected={!!guide}
              value={guide?.price ?? null}
              optional
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("serviceFee")}</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium pt-2 border-t border-border">
              <div className="flex flex-col">
                <span>{t("total")}</span>
                <span className="text-[10px] text-muted-foreground font-light normal-case">
                  * Final quote in 48h
                </span>
              </div>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Complete trip details to see estimated pricing
        </div>
      )}
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  subLabel?: string;
  isSelected: boolean;
  value: number | null;
  optional?: boolean;
  status?: "pending" | "confirmed";
}

function SummaryItem({
  label,
  subLabel,
  isSelected,
  value,
  optional,
  status,
}: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-muted-foreground">{label}</span>
        {isSelected && subLabel && (
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono">
            {subLabel}
          </span>
        )}
      </div>
      {isSelected ? (
        status === "pending" || value === null ? (
          <span className="text-amber-600 text-xs font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            Pending Quote
          </span>
        ) : (
          <span className="text-green-600 flex items-center gap-1">
            <RiCheckLine className="size-4" />${value}
          </span>
        )
      ) : (
        <span className="text-muted-foreground">
          {optional ? "Optional" : "-"}
        </span>
      )}
    </div>
  );
}
