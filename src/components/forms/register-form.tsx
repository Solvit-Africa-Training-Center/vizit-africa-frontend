"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  registerInputSchema,
  registerObjectSchema,
  type RegisterInput,
} from "@/lib/schema/auth-schema";
import { register } from "@/actions/auth";
import { Label } from "../ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  RiAlertLine,
  RiArrowRightLine,
  RiLockPasswordLine,
  RiMailLine,
  RiPhoneLine,
  RiUserLine,
} from "@remixicon/react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useState } from "react";

export function RegisterForm() {
  const t = useTranslations("Auth.signup");
  const tCommon = useTranslations("Common");
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
    onSubmit: async ({ value }) => {
      const result = await register(value);

      if (result.success) {
        toast.success("Account created! Check your email to verify.");
        router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
      } else {
        setError(result.error);
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
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
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
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
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
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
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
                type="password"
                placeholder={tCommon("createAccount").split(" ")[0] + "..."}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <InputGroupAddon>
                <RiLockPasswordLine />
              </InputGroupAddon>
            </InputGroup>
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
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
                type="password"
                placeholder={t("confirmPassword")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <InputGroupAddon>
                <RiLockPasswordLine />
              </InputGroupAddon>
            </InputGroup>
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-14 rounded-sm gap-2 text-base font-medium uppercase tracking-wide"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? "Creating..." : tCommon("createAccount")}
          <RiArrowRightLine className="size-5" />
        </Button>
      </div>
    </form>
  );
}
