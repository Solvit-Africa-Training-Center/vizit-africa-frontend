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
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
      re_password: "",
      role: "CLIENT" as "CLIENT" | "VENDOR" | "ADMIN",
    },
    validators: {
      onChange: registerObjectSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await register(value);
      console.log(result);
      if (result.success) {
        toast.success("Account created! Check your email to verify.");
        router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
      } else {
        let errorMessage =
          result.error || "Registration failed. Please check the fields.";

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
      <form.Field name="full_name">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="full_name">{t("fullName")}</Label>
            <InputGroup>
              <InputGroupInput
                id="full_name"
                name="full_name"
                type="text"
                placeholder="John Doe"
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
                placeholder="name@example.com"
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

      <form.Field name="phone_number">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="phone_number">{t("phoneNumber")}</Label>
            <InputGroup>
              <InputGroupInput
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="+251 912 345 678"
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

      <form.Field name="re_password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="re_password">{t("confirmPassword")}</Label>
            <InputGroup>
              <InputGroupInput
                id="re_password"
                name="re_password"
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
          {form.state.isSubmitting ? "Creating..." : tCommon("createAccount")}
          {!form.state.isSubmitting && <RiArrowRightLine className="size-5" />}
        </Button>
      </div>
    </form>
  );
}
