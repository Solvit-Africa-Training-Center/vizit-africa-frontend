import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/components/forms/register-form";
import { Link } from "@/i18n/navigation";
import { GoogleAuthButton } from "@/components/forms/google-auth-button";

export default async function SignupPage() {
  const t = await getTranslations("Auth.signup");

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-medium uppercase text-foreground mb-2">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          {t("subtitle")}
        </p>
      </div>

      <RegisterForm />

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/40"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-medium">
          <span className="bg-background px-4 text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>
      </div>

      <GoogleAuthButton label="Sign up with Google" />

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
