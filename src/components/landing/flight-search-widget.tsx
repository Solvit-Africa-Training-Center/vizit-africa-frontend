"use client";

import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { SectionTitle } from "./section-title";
import { Button } from "@/components/ui/button";
import {
  RiMapPinLine,
  RiCalendarEventLine,
  RiUserLine,
  RiSearchLine,
} from "@remixicon/react";

export function FlightSearchWidget() {
  const router = useRouter();
  const locale = useLocale();

  // We reuse PopularRoutes translations for the section title, or fall back if needed
  // For now, hardcode or find the right translation key, but let's use t("title") if it exists, else raw strings since this is a new design.
  // Actually, let's keep it clean and just use raw text for this structural upgrade, or we can use the existing translations if they fit.

  const handleSearch = () => {
    router.push(`/${locale}/plan-trip`);
  };

  return (
    <section className="py-20 md:py-28 bg-background border-t border-border">
      <div className="container max-w-5xl mx-auto px-5 md:px-10">
        <div className="mb-12 text-center">
          <SectionTitle
            overline="PLAN YOUR TRIP"
            title="Where to next?"
            description="Book flights, hotels, and experiences in Rwanda and across Africa."
            className="mx-auto"
          />
        </div>

        {/* Flight Search Console */}
        <div className="bg-background rounded-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 md:p-4 relative">
          {/* Top Decorator Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/20 rounded-t-sm" />
          <div className="absolute top-0 left-0 w-1/4 h-[2px] bg-primary rounded-tl-sm" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            {/* From Input */}
            <div className="md:col-span-3 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                <RiMapPinLine className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Leaving from"
                className="w-full h-14 pl-12 pr-4 bg-muted/30 border border-transparent hover:border-border focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm text-sm font-medium placeholder:text-muted-foreground/50"
              />
            </div>

            {/* To Input */}
            <div className="md:col-span-3 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                <RiMapPinLine className="w-5 h-5" />
              </div>
              <input
                type="text"
                value="Kigali (KGL)"
                readOnly
                className="w-full h-14 pl-12 pr-4 bg-muted/10 border border-transparent outline-none rounded-sm text-sm font-bold text-foreground"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-mono">
                Dest
              </span>
            </div>

            {/* Dates Input */}
            <div className="md:col-span-2 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                <RiCalendarEventLine className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Dates"
                className="w-full h-14 pl-12 pr-4 bg-muted/30 border border-transparent hover:border-border focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm text-sm font-medium placeholder:text-muted-foreground/50 cursor-pointer"
                readOnly
              />
            </div>

            {/* Passengers Input */}
            <div className="md:col-span-2 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                <RiUserLine className="w-5 h-5" />
              </div>
              <input
                type="text"
                value="1 Adult"
                readOnly
                className="w-full h-14 pl-12 pr-4 bg-muted/30 border border-transparent hover:border-border focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm text-sm font-medium cursor-pointer"
              />
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <Button
                type="button"
                onClick={handleSearch}
                className="w-full h-14 font-display uppercase tracking-widest text-xs rounded-sm transition-all hover:scale-[1.02]"
              >
                <RiSearchLine className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Subtle helper text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground tracking-wide">
            Need a bespoke itinerary?{" "}
            <button
              type="button"
              onClick={handleSearch}
              className="text-primary hover:underline underline-offset-4"
            >
              Build a custom trip
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
