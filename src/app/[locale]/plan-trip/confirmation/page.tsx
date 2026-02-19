"use client";

import { RiArrowRightLine, RiCheckboxCircleFill } from "@remixicon/react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect } from "react";
import { Footer } from "@/components/landing";
import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTripStore } from "@/store/trip-store";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id") || "REQ-UNKNOWN";
  const t = useTranslations("PlanTrip.confirmation");

  useEffect(() => {
    useTripStore.getState().clearTrip();
  }, []);

  return (
    <div className="bg-background max-w-3xl mx-auto">
      <div className="p-8 md:p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6">
          <RiCheckboxCircleFill className="size-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-medium text-foreground mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="px-8 pb-12 space-y-8 max-w-lg mx-auto">
        <div className="text-center py-4 border-y border-border/40">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
            {t("referenceNumber")}
          </p>
          <p className="font-display text-2xl font-medium tracking-wide">
            {requestId}
          </p>
        </div>

        <div className="text-left space-y-4">
          <h3 className="font-semibold text-lg">{t("whatNext")}</h3>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="shrink-0 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                1
              </span>
              <div>
                <p className="font-medium text-foreground">
                  {t("steps.1.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("steps.1.description")}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                2
              </span>
              <div>
                <p className="font-medium text-foreground">
                  {t("steps.2.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("steps.2.description")}
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/profile" className="flex-1">
            <Button className="w-full" size="lg">
              {t("dashboardButton")} <RiArrowRightLine />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              {t("homeButton")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-24 pb-20 px-5">
        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
