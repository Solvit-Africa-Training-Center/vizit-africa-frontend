import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SetPasswordForm } from "@/components/forms/set-password-form";
import { Link } from "@/i18n/navigation";

export default async function SetPasswordPage() {
  const t = await getTranslations("Auth.setPassword");
  const tCommon = await getTranslations("Common");

  return (
    <div className="w-full">
      <div className="mb-10">
        <Link href="/" className="inline-block mb-4">
          <span className="font-display text-2xl font-medium text-primary">
            {tCommon("brandName")}
          </span>
        </Link>
        <h1 className="font-display text-4xl font-medium uppercase text-foreground mb-2">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          {t("subtitle")}
        </p>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        <SetPasswordForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground mt-8 font-light">
        {t("remembered")}{" "}
        <Link
          href="/login"
          className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          {tCommon("login")}
        </Link>
      </p>
    </div>
  );
}
