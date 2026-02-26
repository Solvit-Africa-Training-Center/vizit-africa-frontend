"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-ink text-white relative overflow-hidden p-6 isolate">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,oklch(65%_0.06_245/0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 -right-32 size-96 bg-primary-light/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-32 -left-32 size-96 bg-primary-light/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-12">
        <div className="relative">
          <h1 className="text-[12rem] md:text-[18rem] font-display font-medium leading-none text-white/5 opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 user-select-none mix-blend-overlay">
            404
          </h1>
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white">
              {t("title")}
            </h2>
            <p className="text-white/70 font-light max-w-md mx-auto text-lg">
              {t("description")}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link href="/">
            <Button className="rounded-full px-8 h-12 bg-white text-surface-ink hover:bg-white/90 font-display uppercase tracking-widest text-[10px] font-bold w-full sm:w-auto shadow-xl shadow-white/10 transition-all">
              {t("returnHome")}
            </Button>
          </Link>
          <Link href="/plan-trip">
            <Button
              variant="outline"
              className="rounded-full px-8 h-12 bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white font-display uppercase tracking-widest text-[10px] font-bold w-full sm:w-auto transition-all"
            >
              {t("startJourney")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
