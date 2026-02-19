import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { UserProvider } from "@/components/user-provider";
import { getSession } from "@/lib/auth/session";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "fr")) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, user] = await Promise.all([getMessages(), getSession()]);

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <UserProvider user={user}>{children}</UserProvider>
      </Providers>
    </NextIntlClientProvider>
  );
}
