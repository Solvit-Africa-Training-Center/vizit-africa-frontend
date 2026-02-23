"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname as useNextPathname } from "next/navigation";
import { usePathname as useIntlPathname } from "@/i18n/navigation";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

function PathLogger({ children }: { children: React.ReactNode }) {
  const nextPathname = useNextPathname();
  const intlPathname = useIntlPathname();
  const locale = useLocale();

  useEffect(() => {
    console.log("[NAV DEBUG]", {
      locale,
      nextPathname,
      intlPathname,
      browserPathname: window.location.pathname,
      browserHref: window.location.href,
    });
  }, [locale, nextPathname, intlPathname]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PathLogger>
        <GoogleOAuthProvider
          clientId={
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            "227362966925-jkk00ud4asi7grm1pvofuip8nbkr5nq0.apps.googleusercontent.com"
          }
        >
          {children}
          <Toaster />
        </GoogleOAuthProvider>
      </PathLogger>
    </QueryClientProvider>
  );
}
