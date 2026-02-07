"use client";

import { motion } from "motion/react";
import {
  RiMailLine,
  RiPhoneLine,
  RiArrowLeftLine,
  RiArrowRightLine,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TripInfo } from "@/lib/plan_trip-types";

interface ContactInfoStepProps {
  tripInfo: TripInfo;
  setTripInfo: (info: TripInfo) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function ContactInfoStep({
  tripInfo,
  setTripInfo,
  onNext,
  onBack,
  canProceed,
}: ContactInfoStepProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white border rounded-xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Contact Information
          </h2>
          <p className="text-muted-foreground">
            How can we reach you about your booking?
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={tripInfo.name}
              onChange={(e) =>
                setTripInfo({ ...tripInfo, name: e.target.value })
              }
              className="bg-white"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={tripInfo.email}
                  onChange={(e) =>
                    setTripInfo({
                      ...tripInfo,
                      email: e.target.value,
                    })
                  }
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <div className="relative">
                <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={tripInfo.phone}
                  onChange={(e) =>
                    setTripInfo({
                      ...tripInfo,
                      phone: e.target.value,
                    })
                  }
                  className="pl-10 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={onBack}>
            <RiArrowLeftLine /> Back
          </Button>
          <Button
            size="lg"
            className="flex-1"
            disabled={!canProceed}
            onClick={onNext}
          >
            Continue to Services
            <RiArrowRightLine />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
