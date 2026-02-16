"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { verifyEmail } from "@/actions/auth";
import { Label } from "../ui/label";
import { InputGroup, InputGroupInput } from "../ui/input-group";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useState } from "react";
import { RiAlertLine, RiArrowRightLine } from "@remixicon/react";

type VerifyEmailFormProps = {
    email: string;
};

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
    const t = useTranslations("Auth.verifyEmail");
    const tCommon = useTranslations("Common");
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            code: "",
        },
        onSubmit: async ({ value }) => {
            const result = await verifyEmail({ email, code: value.code });

            if (result.success) {
                toast.success("Email verified successfully!");
                router.push("/login");
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

            <div className="space-y-2">
                <Label htmlFor="code">{t("codeLabel")}</Label>
                <form.Field name="code">
                    {(field) => (
                        <>
                            <InputGroup>
                                <InputGroupInput
                                    id="code"
                                    name="code"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    maxLength={6}
                                />
                            </InputGroup>
                            {field.state.meta.errors ? (
                                <p className="text-sm text-destructive">
                                    {field.state.meta.errors.join(", ")}
                                </p>
                            ) : null}
                        </>
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
