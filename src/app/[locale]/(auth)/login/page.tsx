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

      <LoginForm />

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/40"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-medium">
          <span className="bg-background px-4 text-muted-foreground">
            {t("orContinue")}
          </span>
        </div>
      </div>

      <GoogleAuthButton label="Continue with Google" />

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
