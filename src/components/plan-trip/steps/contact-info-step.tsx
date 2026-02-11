"use client";

import { motion } from "motion/react";
import {
  RiMailLine,
  RiPhoneLine,
  RiArrowLeftLine,
  RiArrowRightLine,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import type { TripInfo } from "@/lib/plan_trip-types";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("PlanTrip.contactInfo");
  const tCommon = useTranslations("Common");

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl"
    >
      <div className="space-y-8">
        <div>
          <h2 className="font-display text-2xl font-medium mb-2">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <InputGroup>
              <InputGroupInput
                id="name"
                placeholder={t("namePlaceholder")}
                value={tripInfo.name}
                onChange={(e) =>
                  setTripInfo({ ...tripInfo, name: e.target.value })
                }
              />
            </InputGroup>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={tripInfo.email}
                  onChange={(e) =>
                    setTripInfo({
                      ...tripInfo,
                      email: e.target.value,
                    })
                  }
                />
                <InputGroupAddon>
                  <RiMailLine />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="phone"
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  value={tripInfo.phone}
                  onChange={(e) =>
                    setTripInfo({
                      ...tripInfo,
                      phone: e.target.value,
                    })
                  }
                />
                <InputGroupAddon>
                  <RiPhoneLine />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={onBack}>
            <RiArrowLeftLine /> {tCommon("back")}
          </Button>
          <Button
            size="lg"
            className="flex-1"
            disabled={!canProceed}
            onClick={onNext}
          >
            {t("continue")}
            <RiArrowRightLine />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
