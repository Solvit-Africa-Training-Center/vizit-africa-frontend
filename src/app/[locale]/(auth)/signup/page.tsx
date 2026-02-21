import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/components/forms/register-form";
import { Link } from "@/i18n/navigation";

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
