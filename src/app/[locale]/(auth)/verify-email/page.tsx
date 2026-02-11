import { verifyEmail } from "@/actions/auth";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { RiCheckLine, RiCloseLine } from "@remixicon/react";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const t = await getTranslations("Auth.verifyEmail");
  const { email, token } = await searchParams;

  let success = false;
  let errorMessage = "";

  if (email && token) {
    const result = await verifyEmail({ email, code: token });
    success = result.success;
    if (!result.success) {
      errorMessage = result.error;
    }
  } else {
    errorMessage = "Missing email or verification token";
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
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
    </div>
  );
}
