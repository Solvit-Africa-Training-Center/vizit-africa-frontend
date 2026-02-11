"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { loginInputSchema, type LoginInput } from "@/lib/schema/auth-schema";
import { login } from "@/actions/auth";
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
  RiMailLine,
} from "@remixicon/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginInputSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await login(value);
      if (result.success) {
        toast.success("Logged in successfully");
        router.push("/profile");
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

      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="password">{t("passwordLabel")}</Label>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
              >
                <RiEyeLine />
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
          {form.state.isSubmitting ? "Logging in..." : tCommon("login")}
          <RiArrowRightLine className="size-5" />
        </Button>
      </div>
    </form>
  );
}
