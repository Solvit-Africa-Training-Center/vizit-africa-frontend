"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useParams();
  const lang = (locale as string) || "en";
  const direction = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={lang} dir={direction}>
      <head>
        <title>Something went wrong | Vizit Africa</title>
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface-ink text-white relative overflow-hidden p-6 isolate">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,oklch(65%_0.06_245/0.15)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 text-center max-w-lg mx-auto">
            <h1 className="text-[12rem] font-display font-medium leading-none text-white/5 opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 user-select-none">
              ERROR
            </h1>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">
                We hit a snag.
              </h2>
              <p className="text-white/70 font-light mb-8 max-w-md mx-auto">
                An unexpected error occurred while processing your request. Our
                team has been notified.
              </p>
              <Button
                onClick={() => reset()}
                className="rounded-full px-8 h-12 bg-white text-surface-ink hover:bg-white/90 font-display uppercase tracking-widest text-[10px] font-bold transition-all shadow-xl shadow-white/10"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
