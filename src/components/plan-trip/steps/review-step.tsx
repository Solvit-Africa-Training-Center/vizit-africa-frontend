"use client";

import { motion } from "motion/react";
import { RiCheckLine, RiArrowLeftLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookingSummary } from "@/components/plan-trip";
import type { TripInfo, Selections } from "@/lib/plan_trip-types";
import { DRIVER_SURCHARGE } from "@/lib/plan-trip-data";
import { useTranslations } from "next-intl";

interface ReviewStepProps {
  tripInfo: TripInfo;
  selections: Selections;
  days: number;
  travelers: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewStep({
  tripInfo,
  selections,
  days,
  travelers,
  subtotal,
  serviceFee,
  total,
  onBack,
  onSubmit,
}: ReviewStepProps) {
  const t = useTranslations("PlanTrip.review");
  const tCommon = useTranslations("Common");

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="size-20 bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <RiCheckLine className="size-10" />
          </div>
          <h2 className="font-display text-3xl font-medium uppercase tracking-tight">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            {t("subtitle")}
          </p>
        </div>

        <BookingSummary
          currentStep={4}
          tripInfo={tripInfo}
          selections={selections}
          days={days}
          travelers={travelers}
          driverSurcharge={DRIVER_SURCHARGE}
          subtotal={subtotal}
          serviceFee={serviceFee}
          total={total}
        />

        <Alert className="bg-primary/5 border-primary/20 rounded-none">
          <AlertDescription className="text-foreground text-center font-medium">
            {t("alert")}
          </AlertDescription>
        </Alert>

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            <RiArrowLeftLine className="mr-2" /> {tCommon("back")}
          </Button>
          <Button size="lg" className="flex-2" onClick={onSubmit}>
            Request Quote
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
