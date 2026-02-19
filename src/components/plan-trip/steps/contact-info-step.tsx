"use client";

import { motion } from "motion/react";
import { RiMailLine, RiPhoneLine } from "@remixicon/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TripInfo } from "@/lib/plan_trip-types";
import { useTranslations } from "next-intl";
import type { TripForm, TripFormValues } from "@/hooks/use-trip-form";

interface ContactInfoStepProps {
  form: TripForm;
  tripInfo: TripInfo;
  setTripInfo: (info: Partial<TripInfo>) => void;
}

export function ContactInfoStep({
  form,
  tripInfo,
  setTripInfo,
}: ContactInfoStepProps) {
  const t = useTranslations("PlanTrip.contactInfo");

  return (
    <motion.div
      key="step3"
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
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }) => (!value ? "name is required" : undefined),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")}</Label>
                <InputGroup>
                  <InputGroupInput
                    id="name"
                    placeholder={t("namePlaceholder")}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setTripInfo({ name: e.target.value });
                    }}
                    onBlur={field.handleBlur}
                  />
                </InputGroup>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid sm:grid-cols-2 gap-6">
            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) => {
                  if (!value) return "email is required";
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return "enter a valid email address";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setTripInfo({ email: e.target.value });
                      }}
                      onBlur={field.handleBlur}
                    />
                    <InputGroupAddon>
                      <RiMailLine />
                    </InputGroupAddon>
                  </InputGroup>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="phone"
                      type="tel"
                      placeholder={t("phonePlaceholder")}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setTripInfo({ phone: e.target.value });
                      }}
                    />
                    <InputGroupAddon>
                      <RiPhoneLine />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="tripPurpose">
            {(field) => (
              <div className="space-y-2">
                <Label>{t("purpose")}</Label>
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
                      onClick={() => {
                        field.handleChange(
                          purpose as TripFormValues["tripPurpose"],
                        );
                        setTripInfo({
                          tripPurpose: purpose as TripInfo["tripPurpose"],
                        });
                      }}
                      className={`px-4 py-3 rounded-none border text-sm font-medium capitalize transition-all duration-300 hover:tracking-wide ${
                        field.state.value === purpose
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary"
                      }`}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="specialRequests">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="specialRequests">{t("specialRequests")}</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any specific requirements or interests?"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setTripInfo({ specialRequests: e.target.value });
                  }}
                  className="min-h-[100px] bg-primary-foreground"
                />
              </div>
            )}
          </form.Field>
        </div>
      </div>
    </motion.div>
  );
}
