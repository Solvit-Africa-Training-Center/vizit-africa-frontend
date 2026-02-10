import { verifyEmail } from "@/actions/auth";
import { Link } from "@/i18n";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { toast } from "sonner";

export default async function VerifyEmailPage(props: PageProps<"/[locale]/verify-email">) {
  const t = await getTranslations("Auth.verifyEmail");
  const {locale} = await props.params
  const {email, token} = await props.searchParams

  const result = await verifyEmail({email: email as string, code: token as string})
console.log(result)
  if(result.success){
    redirect({href: "/", locale})
  }else if(result.error){
    toast.error(result.error)
  }
  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        {result.success ? <p className="text-muted-foreground">{t("success")}</p> : <p className="text-muted-foreground">{t("error")}</p>}
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Redirecting to {result.success ? "profile" : "login"} page in 4 seconds...
      </div>
      <div className="text-center text-sm text-muted-foreground">
        <Link href={result.success ? "/profile" : "/login"} className="underline hover:text-foreground">
          {t(result.success ? "goToProfile" : "backToLogin")}
        </Link>
      </div>
    </div>
  );
}
