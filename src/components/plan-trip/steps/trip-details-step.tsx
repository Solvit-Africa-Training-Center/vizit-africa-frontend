"use client";

import { motion } from "motion/react";
import { format } from "date-fns";
import {
  RiMapPinLine,
  RiCalendarLine,
  RiTeamLine,
  RiArrowRightLine,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { TripInfo } from "@/lib/plan_trip-types";
import { useTranslations } from "next-intl";

interface TripDetailsStepProps {
  tripInfo: TripInfo;
  setTripInfo: (info: TripInfo) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function TripDetailsStep({
  tripInfo,
  setTripInfo,
  onNext,
  canProceed,
}: TripDetailsStepProps) {
  const t = useTranslations("PlanTrip.tripDetails");

  return (
    <motion.div
      key="step1"
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

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="departureCity">{t("departingFrom")}</Label>
            <InputGroup>
              <InputGroupInput
                id="departureCity"
                placeholder={t("departingPlaceholder")}
                value={tripInfo.departureCity}
                onChange={(e) =>
                  setTripInfo({
                    ...tripInfo,
                    departureCity: e.target.value,
                  })
                }
              />
              <InputGroupAddon>
                <RiMapPinLine />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="arrival">{t("arrival")}</Label>
            <div className="relative">
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-10 text-left font-normal bg-white justify-start relative",
                        !tripInfo.arrivalDate && "text-muted-foreground",
                      )}
                    />
                  }
                >
                  <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  {tripInfo.arrivalDate ? (
                    format(new Date(tripInfo.arrivalDate), "PPP")
                  ) : (
                    <span>{t("pickDate")}</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      tripInfo.arrivalDate
                        ? new Date(tripInfo.arrivalDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setTripInfo({
                        ...tripInfo,
                        arrivalDate: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="departure">{t("departure")}</Label>
            <div className="relative">
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-10 text-left font-normal bg-white justify-start relative",
                        !tripInfo.departureDate && "text-muted-foreground",
                      )}
                    />
                  }
                >
                  <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  {tripInfo.departureDate ? (
                    format(new Date(tripInfo.departureDate), "PPP")
                  ) : (
                    <span>{t("pickDate")}</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      tripInfo.departureDate
                        ? new Date(tripInfo.departureDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setTripInfo({
                        ...tripInfo,
                        departureDate: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="adults">{t("adults")}</Label>
            <InputGroup>
              <InputGroupInput
                id="adults"
                type="number"
                min={1}
                max={20}
                value={tripInfo.adults}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTripInfo({
                    ...tripInfo,
                    adults: parseInt(e.target.value, 10) || 1,
                  })
                }
              />
              <InputGroupAddon>
                <RiTeamLine />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="children">{t("children")}</Label>
            <InputGroup>
              <InputGroupInput
                id="children"
                type="number"
                min={0}
                max={10}
                value={tripInfo.children}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTripInfo({
                    ...tripInfo,
                    children: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
              <InputGroupAddon>
                <RiTeamLine />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("tripPurpose")}</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "leisure",
              "business",
              "honeymoon",
              "family",
              "adventure",
              "other",
            ].map((purpose) => (
              <button
                key={purpose}
                type="button"
                onClick={() =>
                  setTripInfo({
                    ...tripInfo,
                    tripPurpose: purpose as TripInfo["tripPurpose"],
                  })
                }
                className={`px-4 py-3 rounded-none border text-sm font-medium capitalize transition-all duration-300 hover:tracking-wide ${
                  tripInfo.tripPurpose === purpose
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                }`}
              >
                {t(`purposes.${purpose}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequests">{t("specialRequests")}</Label>
          <Textarea
            id="specialRequests"
            placeholder={t("requestsPlaceholder")}
            value={tripInfo.specialRequests}
            onChange={(e) =>
              setTripInfo({
                ...tripInfo,
                specialRequests: e.target.value,
              })
            }
            className="min-h-[100px] bg-white"
          />
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!canProceed}
          onClick={onNext}
        >
          {t("continue")}
          <RiArrowRightLine className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
