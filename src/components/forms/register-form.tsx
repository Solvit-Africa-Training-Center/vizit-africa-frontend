"use client";

import {
  RiAlertLine,
  RiArrowRightLine,
  RiEyeLine,
  RiLockPasswordLine,
  RiMailLine,
  RiPhoneLine,
  RiUserLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { register } from "@/actions/auth";
import { registerObjectSchema } from "@/lib/unified-types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";

export function RegisterForm() {
  const t = useTranslations("Auth.signup");
  const tCommon = useTranslations("Common");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      rePassword: "",
      role: "CLIENT" as "CLIENT" | "VENDOR" | "ADMIN",
    },
    validators: {
      onChange: registerObjectSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await register(value);
      console.log(result);
      if (result.success) {
        toast.success(t("messages.success"));
        router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
      } else {
        let errorMessage =
          result.error || t("messages.error");

        if (result.fieldErrors) {
          const firstError = Object.values(
            result.fieldErrors,
          ).flat()[0] as string;
          if (firstError) {
            errorMessage = firstError;
          }

          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (Object.keys(value).includes(field)) {
              // @ts-expect-error - Form API internal typing
              formApi.setFieldMeta(field, (prev) => ({
                ...prev,
                errorMap: {
                  ...prev?.errorMap,
                  onSubmit: Array.isArray(errors) ? errors.join(", ") : errors,
                },
                errors: Array.isArray(errors) ? errors : [errors],
              }));
            }
          });
        }

        toast.error(errorMessage);
        setError(errorMessage);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {error && (
        <Alert variant={"destructive"}>
          <RiAlertLine />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-1">{error}</AlertDescription>
        </Alert>
      )}
      <form.Field name="fullName">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("fullName")}</Label>
            <InputGroup>
              <InputGroupInput
                id="fullName"
                name="fullName"
                type="text"
                placeholder={t("fullNamePlaceholder")}
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
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <InputGroup>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
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
            <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
            <InputGroup>
              <InputGroupInput
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder={t("phoneNumberPlaceholder")}
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

      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="password">{t("passwordLabel")}</Label>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={`${tCommon("createAccount").split(" ")[0]}...`}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <InputGroupAddon>
                <RiLockPasswordLine />
              </InputGroupAddon>
              <InputGroupAddon
                align={"inline-end"}
                onClick={() => setShowPassword(!showPassword)}
              >
                <RiEyeLine />
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
            <Label htmlFor="rePassword">{t("confirmPassword")}</Label>
            <InputGroup>
              <InputGroupInput
                id="rePassword"
                name="rePassword"
                type={showRePassword ? "text" : "password"}
                placeholder={t("confirmPassword")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <InputGroupAddon>
                <RiLockPasswordLine />
              </InputGroupAddon>
              <InputGroupAddon
                align={"inline-end"}
                onClick={() => setShowRePassword(!showRePassword)}
              >
                <RiEyeLine />
              </InputGroupAddon>
            </InputGroup>
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-14 rounded-sm gap-2 text-base font-medium uppercase tracking-wide"
          loading={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? t("creating") : tCommon("createAccount")}
          {!form.state.isSubmitting && <RiArrowRightLine className="size-5" />}
        </Button>
      </div>
    </form>
  );
}
