import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/components/forms/register-form";
import { Link } from "@/i18n/navigation";
import { GoogleAuthButton } from "@/components/forms/google-auth-button";

export default async function SignupPage() {
  const t = await getTranslations("Auth.signup");

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-light uppercase tracking-tight leading-tight text-foreground mb-2">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-light text-base">
          {t("subtitle")}
        </p>
      </div>

      <RegisterForm />

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

      <GoogleAuthButton label={t("googleSignup")} />

      <p className="text-center text-sm text-muted-foreground mt-8 font-light">
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
