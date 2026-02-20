"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  setPasswordInputSchema,
  type SetPasswordInput,
} from "@/lib/schema/auth-schema";
import { setPassword } from "@/actions/auth";
import { Label } from "../ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  RiAlertLine,
  RiArrowRightLine,
  RiEyeLine,
  RiLockPasswordLine,
} from "@remixicon/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldError } from "../ui/field";

export function SetPasswordForm() {
  const t = useTranslations("Auth.setPassword");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uidb64 = searchParams.get("uidb64") || "";
  const token = searchParams.get("token") || "";

  const form = useForm({
    defaultValues: {
      uidb64: uidb64,
      token: token,
      password: "",
      re_password: "",
    },
    validators: {
      onChange: setPasswordInputSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await setPassword(value);
      if (result.success) {
        toast.success(t("success"));
        router.push("/profile");
      } else {
        toast.error(
          result.error || "Failed to set password. Please check the fields.",
        );
        setError(result.error);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (Object.keys(value).includes(field)) {
              // @ts-ignore
              formApi.setFieldMeta(field, (prev) => ({
                ...prev,
                errors: errors,
              }));
            }
          });
        }
      }
    },
  });

  if (!uidb64 || !token) {
    return (
      <Alert variant="destructive">
        <RiAlertLine />
        <AlertTitle>{t("invalidLink")}</AlertTitle>
        <AlertDescription>{t("invalidLinkDesc")}</AlertDescription>
      </Alert>
    );
  }

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

      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="password">{t("newPassword")}</Label>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("placeholder")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value as string)}
              />
              <InputGroupAddon>
                <RiLockPasswordLine />
              </InputGroupAddon>
              <InputGroupAddon
                align={"inline-end"}
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
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

      <form.Field name="re_password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="re_password">{t("confirmPassword")}</Label>
            <InputGroup>
              <InputGroupInput
                id="re_password"
                type={showPassword ? "text" : "password"}
                placeholder={t("confirmPlaceholder")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value as string)}
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

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-14 rounded-sm gap-2 text-base font-medium uppercase tracking-wide"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? "..." : t("submit")}
          <RiArrowRightLine className="size-5" />
        </Button>
      </div>
    </form>
  );
}
