"use client";

import { RiAlertLine, RiArrowRightLine } from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { verifyEmail } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Label } from "../ui/label";

type VerifyEmailFormProps = {
  email: string;
};

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const t = useTranslations("Auth.verifyEmail");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      code: "",
    },
    onSubmit: async ({ value }) => {
      const result = await verifyEmail({ email, code: value.code });
      console.log(result);
      if (result.success) {
        toast.success("Email verified successfully!");
        router.push("/login");
      } else {
        toast.error(result.error || "Verification failed. Please try again.");
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

      <div className="space-y-4">
        <Label htmlFor="code" className="block text-center">
          {t("codeLabel")}
        </Label>
        <form.Field name="code">
          {(field) => (
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSeparator />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <div className="mt-2 text-center w-full">
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-14 rounded-sm gap-2 text-base font-medium uppercase tracking-wide"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? "Verifying..." : t("verifyButton")}
          <RiArrowRightLine className="size-5" />
        </Button>
      </div>
    </form>
  );
}
