"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  verifyEmailInputSchema,
  type VerifyEmailInput,
} from "@/lib/schema/auth-schema";
import { verifyEmail } from "@/actions/auth";
import { Label } from "../ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  RiMailLine,
  RiShieldKeyholeLine,
  RiArrowRightLine,
  RiLoader4Line,
} from "@remixicon/react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function VerifyEmailForm() {
  const t = useTranslations("Auth.verifyEmail");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const codeParam = searchParams.get("code") || "";
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<VerifyEmailInput>({
    defaultValues: {
      email: emailParam,
      code: codeParam, // Changed from otp to code to match schema/url param
    },
    validators: {
      onChange: verifyEmailInputSchema,
    },
    onSubmit: async ({ value }) => {
      setIsVerifying(true);
      const result = await verifyEmail(value);
      setIsVerifying(false);

      if (result.success) {
        toast.success("Email verified successfully");
        router.push("/login?verified=true");
      } else {
        toast.error(result.error);
        if (result.fieldErrors) {
          console.error(result.fieldErrors);
        }
      }
    },
  });

  useEffect(() => {
    if (emailParam && codeParam) {
      form.handleSubmit();
    }
  }, [emailParam, codeParam]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <RiLoader4Line className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
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
      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <InputGroup>
              <InputGroupInput
                id="email"
                type="email"
                placeholder="name@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                readOnly={!!emailParam} // Read only if email came from query param
                className={emailParam ? "bg-muted text-muted-foreground" : ""}
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

      <form.Field name="code">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="code">{t("otpLabel")}</Label>
            <InputGroup>
              <InputGroupInput
                id="code"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <InputGroupAddon>
                <RiShieldKeyholeLine />
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
          className="w-full h-14 rounded-sm gap-2 text-base font-bold uppercase tracking-wide"
          disabled={form.state.isSubmitting || isVerifying}
        >
          {form.state.isSubmitting || isVerifying
            ? "Verifying..."
            : tCommon("verify")}
          <RiArrowRightLine className="size-5" />
        </Button>
      </div>
    </form>
  );
}
