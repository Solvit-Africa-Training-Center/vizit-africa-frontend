"use client";

import { RiMailLine, RiPhoneLine } from "@remixicon/react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TripInfo } from "@/lib/plan_trip-types";

interface ContactInfoStepProps {
  form: any;
  tripInfo: TripInfo;
  updateTripInfo: (info: Partial<TripInfo>) => void;
}

export function ContactInfoStep({
  form,
  tripInfo,
  updateTripInfo,
}: ContactInfoStepProps) {
  const t = useTranslations("PlanTrip.contactInfo");

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl"
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-medium mb-1">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-xs">{t("subtitle")}</p>
        </div>

        <div className="space-y-4">
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }: { value: string }) => (!value ? "name is required" : undefined),
            }}
          >
            {(field: any) => (
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {t("fullName")}
                </Label>
                <InputGroup>
                  <InputGroupInput
                    id="name"
                    placeholder={t("namePlaceholder")}
                    value={field.state.value}
                    className="h-10 text-sm"
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      updateTripInfo({ name: e.target.value });
                    }}
                    onBlur={field.handleBlur}
                  />
                </InputGroup>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }: { value: string }) => {
                  if (!value) return "email is required";
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return "enter a valid email address";
                  return undefined;
                },
              }}
            >
              {(field: any) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t("email")}
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      value={field.state.value}
                      className="h-10 text-sm"
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        updateTripInfo({ email: e.target.value });
                      }}
                      onBlur={field.handleBlur}
                    />
                    <InputGroupAddon>
                      <RiMailLine className="size-3.5" />
                    </InputGroupAddon>
                  </InputGroup>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field: any) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t("phone")}
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      id="phone"
                      type="tel"
                      placeholder={t("phonePlaceholder")}
                      value={field.state.value}
                      className="h-10 text-sm"
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        updateTripInfo({ phone: e.target.value });
                      }}
                    />
                    <InputGroupAddon>
                      <RiPhoneLine className="size-3.5" />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="tripPurpose">
            {(field: any) => (
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t("purpose")}
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                        field.handleChange(purpose);
                        updateTripInfo({
                          tripPurpose: purpose as any,
                        });
                      }}
                      className={`px-3 py-2 rounded-none border text-xs font-medium capitalize transition-all duration-300 ${
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
            {(field: any) => (
              <div className="space-y-1.5">
                <Label
                  htmlFor="specialRequests"
                  className="text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {t("specialRequests")}
                </Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any specific requirements or interests?"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    updateTripInfo({ specialRequests: e.target.value });
                  }}
                  className="min-h-[80px] text-sm bg-primary-foreground"
                />
              </div>
            )}
          </form.Field>
        </div>
      </div>
    </motion.div>
  );
}
