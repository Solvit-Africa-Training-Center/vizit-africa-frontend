import { verifyEmail } from "@/actions/auth";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { RiCheckLine, RiCloseLine, RiMailLine } from "@remixicon/react";
import { VerifyEmailForm } from "@/components/forms/verify-email-form";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const t = await getTranslations("Auth.verifyEmail");
  const { email, token } = await searchParams;

  let success = false;
  let errorMessage = "";
  let showForm = false;

  if (email && token) {
    // Automatic verification via email link
    const result = await verifyEmail({ email, code: token });
    success = result.success;
    if (!result.success) {
      errorMessage = result.error;
    }
  } else if (email && !token) {
    // Show manual entry form
    showForm = true;
  } else {
    // Missing email
    errorMessage = "Missing email address";
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {showForm ? (
        <>
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <RiMailLine className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-medium tracking-tight">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">
              We've sent a verification code to <strong>{email}</strong>. Enter it below or click the link in your email.
            </p>
          </div>
          <VerifyEmailForm email={email!} />
          <div className="text-center text-sm text-muted-foreground">
            <Link
              href="/signup"
              className="underline hover:text-foreground"
            >
              Back to Sign Up
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4 text-center">
            {success ? (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <RiCheckLine className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-medium tracking-tight">
                  {t("title")}
                </h1>
                <p className="text-muted-foreground">
                  Your email has been verified successfully.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/60 flex items-center justify-center">
                  <RiCloseLine className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-3xl font-medium tracking-tight">
                  Verification Failed
                </h1>
                <p className="text-destructive">{errorMessage}</p>
              </>
            )}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <Link
              href={success ? "/login" : "/signup"}
              className="underline hover:text-foreground"
            >
              {success ? "Continue to Login" : "Back to Sign Up"}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
