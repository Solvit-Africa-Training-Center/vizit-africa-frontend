"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname as useNextPathname } from "next/navigation";
import { usePathname as useIntlPathname } from "@/i18n/navigation";
import { Toaster } from "@/components/ui/sonner";

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
        {children}
        <Toaster />
      </PathLogger>
    </QueryClientProvider>
  );
}
