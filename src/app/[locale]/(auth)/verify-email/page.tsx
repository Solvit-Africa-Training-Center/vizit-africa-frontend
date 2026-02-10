import { VerifyEmailForm } from "@/components/forms/verify-email-form";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default async function VerifyEmailPage() {
  const t = useTranslations("Auth.verifyEmail");

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <VerifyEmailForm />
      <div className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="underline hover:text-foreground">
          {t("backToLogin")}
        </Link>
      </div>
    </div>
  );
}
