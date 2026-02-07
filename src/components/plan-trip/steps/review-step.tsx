"use client";

import { motion } from "motion/react";
import { RiCheckLine, RiArrowLeftLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookingSummary } from "@/components/plan-trip";
import type { TripInfo, Selections } from "@/lib/plan_trip-types";
import { DRIVER_SURCHARGE } from "@/lib/plan-trip-data";

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
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white border rounded-xl p-6 md:p-8 space-y-6">
        <div className="text-center">
          <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiCheckLine className="size-8" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Review Your Trip
          </h2>
          <p className="text-muted-foreground">
            Please review your details before confirming
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

        <Alert className="bg-primary-subtle border-primary/20">
          <AlertDescription className="text-foreground">
            After submitting, we'll review your request and send you a payment
            link within 24 hours.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={onBack}>
            <RiArrowLeftLine /> Back
          </Button>
          <Button size="lg" className="flex-1" onClick={onSubmit}>
            Submit Booking Request
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
