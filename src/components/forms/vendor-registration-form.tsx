"use client";

import {
  RiAlertLine,
  RiArrowRightLine,
  RiBuildingLine,
  RiGlobalLine,
  RiLockPasswordLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { register } from "@/actions/auth";
import { registerVendor } from "@/actions/vendors";
import { useRouter } from "@/i18n/navigation";
import { 
  userSchema, 
  registerObjectSchema, 
  type RegisterInput,
  type CreateVendorInput 
} from "@/lib/unified-types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Combine schemas for the form
// We remove role from register as it's implied
const formSchema = registerObjectSchema.omit({ role: true }).extend({
  bio: z.string().optional(),
  businessName: z.string().min(2, "Business name is required"),
  vendorType: z.enum([
    "hotel",
    "car_rental",
    "guide",
    "experience",
    "transport",
    "other",
  ]),
  address: z.string().min(1, "Address is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export function VendorRegistrationForm() {
  const t = useTranslations("Partners.apply");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      rePassword: "",
      businessName: "",
      vendorType: "hotel" as "hotel" | "car_rental" | "guide" | "experience" | "transport" | "other",
      address: "",
      website: "",
      bio: "",
    },
    validators: {
      // @ts-expect-error zod to tanstack adapter issue usually
      onChange: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setError(null);

      // 1. Register User
      const registerData: RegisterInput = {
        fullName: value.fullName,
        email: value.email,
        phoneNumber: value.phoneNumber,
        password: value.password,
        rePassword: value.rePassword,
        role: "VENDOR",
      };

      const registerResult = await register(registerData);

      if (!registerResult.success) {
        toast.error(
          registerResult.error || t("messages.error"),
        );
        setError(registerResult.error || t("messages.error"));
        if (registerResult.fieldErrors) {
          Object.entries(registerResult.fieldErrors).forEach(
            ([field, errors]) => {
              if (Object.keys(value).includes(field)) {
                // @ts-expect-error
                formApi.setFieldMeta(field, (prev) => ({
                  ...prev,
                  errors: errors,
                }));
              }
            },
          );
        }
        return;
      }

      // 2. Create Vendor Profile
      const vendorData: CreateVendorInput = {
        fullName: value.fullName,
        email: value.email,
        phoneNumber: value.phoneNumber,
        bio: value.bio || "New Vendor",
        businessName: value.businessName,
        vendorType: value.vendorType as any,
        address: value.address,
        website: value.website || "",
      };

      const vendorResult = await registerVendor(vendorData);

      if (!vendorResult.success) {
        toast.error(vendorResult.error || t("messages.profileError"));
        setError(
          vendorResult.error || t("messages.accountCreatedContactSupport"),
        );
        if (vendorResult.fieldErrors) {
          Object.entries(vendorResult.fieldErrors).forEach(
            ([field, errors]) => {
              if (Object.keys(value).includes(field)) {
                // @ts-expect-error
                formApi.setFieldMeta(field, (prev) => ({
                  ...prev,
                  errors: errors,
                }));
              }
            },
          );
        }
        return;
      }

      toast.success(t("messages.success"));
      router.push("/vendor/dashboard"); // Or a specific success page
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {error && (
        <Alert variant={"destructive"}>
          <RiAlertLine />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-1">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 uppercase tracking-tight">{t("accountDetails")}</h3>

        <form.Field name="fullName">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("labels.contactName")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder={t("placeholders.contactName")}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiUserLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="email">{t("labels.email")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("placeholders.email")}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiMailLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="phoneNumber">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t("labels.phone")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder={t("placeholders.phone")}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiPhoneLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="password">{t("labels.password")}</Label>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type="password"
                    placeholder={t("placeholders.password")}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon>
                    <RiLockPasswordLine />
                  </InputGroupAddon>
                </InputGroup>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="rePassword">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="rePassword">{t("labels.confirmPassword")}</Label>
                <InputGroup>
                  <InputGroupInput
                    id="rePassword"
                    name="rePassword"
                    type="password"
                    placeholder={t("placeholders.confirmPassword")}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon>
                    <RiLockPasswordLine />
                  </InputGroupAddon>
                </InputGroup>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 uppercase tracking-tight">
          {t("businessDetails")}
        </h3>

        <form.Field name="businessName">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="businessName">{t("labels.businessName")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="businessName"
                  name="businessName"
                  placeholder={t("placeholders.businessName")}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiBuildingLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field name="vendorType">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="vendorType">{t("labels.businessType")}</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.businessType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">{t("types.hotel")}</SelectItem>
                    <SelectItem value="car_rental">{t("types.car_rental")}</SelectItem>
                    <SelectItem value="guide">{t("types.guide")}</SelectItem>
                    <SelectItem value="experience">{t("types.experience")}</SelectItem>
                    <SelectItem value="transport">{t("types.transport")}</SelectItem>
                    <SelectItem value="other">{t("types.other")}</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="website">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="website">{t("labels.website")}</Label>
                <InputGroup>
                  <InputGroupInput
                    id="website"
                    name="website"
                    placeholder={t("placeholders.website")}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon>
                    <RiGlobalLine />
                  </InputGroupAddon>
                </InputGroup>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="address">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="address">{t("labels.address")}</Label>
              <InputGroup>
                <InputGroupInput
                  id="address"
                  name="address"
                  placeholder={t("placeholders.address")}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon>
                  <RiMapPinLine />
                </InputGroupAddon>
              </InputGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-14 rounded-sm gap-2 text-base font-medium uppercase tracking-wide"
          loading={form.state.isSubmitting}
        >
          {form.state.isSubmitting
            ? t("submitting")
            : t("submit")}
          {!form.state.isSubmitting && <RiArrowRightLine className="size-5" />}
        </Button>
      </div>
    </form>
  );
}
