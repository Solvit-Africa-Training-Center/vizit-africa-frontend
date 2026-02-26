import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/forms/login-form";
import { Link } from "@/i18n/navigation";
import { GoogleAuthButton } from "@/components/forms/google-auth-button";

export default async function LoginPage() {
  const t = await getTranslations("Auth.login");
  const tCommon = await getTranslations("Common");

  return (
    <div className="w-full">
      <div className="mb-10">
        {/* Brand link — display font, primary on hover */}
        <Link href="/" className="inline-flex items-center gap-1.5 mb-6 group">
          <span className="text-primary text-sm">✦</span>
          <span className="font-display text-xl font-medium text-foreground group-hover:text-primary transition-colors duration-300">
            {tCommon("brandName")}
          </span>
        </Link>

        {/* Page title */}
        <h1 className="font-display text-4xl font-light uppercase tracking-tight leading-tight text-foreground mb-2">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-light text-base">
          {t("subtitle")}
        </p>
      </div>

      <LoginForm />

      {/* Divider */}
      <div className="relative my-9">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
            {t("orContinue")}
          </span>
        </div>
      </div>

      <GoogleAuthButton label={t("googleContinue")} />

      <p className="text-center text-sm text-muted-foreground mt-8 font-light">
        {t("noAccount")}{" "}
        <Link
          href="/signup"
          className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          {t("createAccount")}
        </Link>
      </p>
    </div>
  );
}
