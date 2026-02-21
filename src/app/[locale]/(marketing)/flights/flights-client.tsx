"use client";

import {
  RiArrowLeftRightLine,
  RiCalendarLine,
  RiFlightLandLine,
  RiFlightTakeoffLine,
  RiPlaneLine,
  RiSearchLine,
  RiSortAsc,
  RiUserLine,
} from "@remixicon/react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Link } from "@/i18n/navigation";
import { serviceSchema, type ServiceResponse } from "@/lib/unified-types";

const POPULAR_DESTINATIONS = [
  { code: "KGL", city: "Kigali" },
  { code: "NBO", city: "Nairobi" },
  { code: "ADD", city: "Addis Ababa" },
  { code: "DXB", city: "Dubai" },
  { code: "AMS", city: "Amsterdam" },
  { code: "IST", city: "Istanbul" },
  { code: "LHR", city: "London" },
  { code: "BRU", city: "Brussels" },
];

type SortOption = "price" | "duration" | "departure";

interface FlightsClientProps {
  initialFlights: ServiceResponse[];
}

export default function FlightsClient({ initialFlights }: FlightsClientProps) {
  const searchParams = useSearchParams();
  const t = useTranslations("FlightsPage");

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "Kigali (KGL)");
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [stopsFilter, setStopsFilter] = useState<number | null>(null);
  const [classFilter, setClassFilter] = useState<string>("all");

  const filteredFlights = useMemo(() => {
    let result = [...initialFlights];

    if (from) {
      const fromSearch = from.toLowerCase();
      result = result.filter((f) => {
        const depCity =
          (f.metadata?.departureCity as string)?.toLowerCase() || "";
        const depAirport =
          (f.metadata?.departureAirport as string)?.toLowerCase() || "";
        return depCity.includes(fromSearch) || depAirport.includes(fromSearch);
      });
    }

    result = result.filter((f) => Number(f.base_price) <= maxPrice);

    if (stopsFilter !== null) {
      result = result.filter(
        (f) => (f.metadata?.stops as number) === stopsFilter,
      );
    }

    if (classFilter !== "all") {
      result = result.filter(
        (f) => (f.metadata?.cabinClass as string) === classFilter,
      );
    }

    result.sort((a, b) => {
      if (sortBy === "price")
        return Number(a.base_price) - Number(b.base_price);
      if (sortBy === "departure") {
        const timeA = new Date(
          (a.metadata?.departureTime as string) || 0,
        ).getTime();
        const timeB = new Date(
          (b.metadata?.departureTime as string) || 0,
        ).getTime();
        return timeA - timeB;
      }
      return 0;
    });

    return result;
  }, [from, maxPrice, stopsFilter, classFilter, sortBy, initialFlights]);

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "--:--";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <PageHeader
        title={t("title")}
        overline={t("overline")}
        description={t("description")}
        className="mb-16"
      />

      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        {/* search bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/30 border border-border/50 rounded-2xl p-6 md:p-8 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-4">
              <label
                htmlFor="search-from"
                className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3 font-mono"
              >
                {t("labels.from")}
              </label>
              <div className="relative">
                <RiFlightTakeoffLine className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="search-from"
                  type="text"
                  placeholder="City or airport"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  list="search-departure"
                  className="w-full bg-transparent border-none pl-8 py-2 text-lg focus:ring-0 focus:outline-hidden placeholder:text-muted-foreground/30"
                />
                <datalist id="search-departure">
                  {POPULAR_DESTINATIONS.map((d) => (
                    <option key={d.code} value={`${d.city} (${d.code})`} />
                  ))}
                </datalist>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
              </div>
            </div>

            <div className="hidden md:flex md:col-span-1 justify-center pb-2">
              <button
                type="button"
                onClick={() => {
                  const temp = from;
                  setFrom(to);
                  setTo(temp);
                }}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <RiArrowLeftRightLine className="w-4 h-4" />
              </button>
            </div>

            <div className="md:col-span-3">
              <label
                htmlFor="search-to"
                className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3 font-mono"
              >
                {t("labels.to")}
              </label>
              <div className="relative">
                <RiFlightLandLine className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="search-to"
                  type="text"
                  placeholder="Kigali (KGL)"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-transparent border-none pl-8 py-2 text-lg focus:ring-0 focus:outline-hidden placeholder:text-muted-foreground/30"
                />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="search-depart"
                className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3 font-mono"
              >
                {t("labels.depart")}
              </label>
              <div className="relative">
                <RiCalendarLine className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="search-depart"
                  type="date"
                  className="w-full bg-transparent border-none pl-8 py-2 text-lg focus:ring-0 focus:outline-hidden"
                />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
              </div>
            </div>

            <div className="md:col-span-1">
              <label
                htmlFor="search-pax"
                className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3 font-mono"
              >
                {t("labels.pax")}
              </label>
              <div className="relative">
                <RiUserLine className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  id="search-pax"
                  className="w-full bg-transparent border-none pl-8 py-2 text-lg focus:ring-0 focus:outline-hidden appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
              </div>
            </div>

            <div className="md:col-span-1 md:self-end">
              <button
                type="button"
                className="w-12 h-12 bg-primary hover:bg-primary-light text-primary-foreground rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary/20"
              >
                <RiSearchLine className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* filters sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-10"
          >
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                {t("labels.sortBy")}
              </h3>
              <div className="space-y-2">
                {(["price", "duration", "departure"] as SortOption[]).map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSortBy(opt)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                        sortBy === opt
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <RiSortAsc className="w-3.5 h-3.5 inline mr-2" />
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                {t("labels.stops")}
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Any", value: null },
                  { label: "Direct only", value: 0 },
                  { label: "1 stop", value: 1 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setStopsFilter(opt.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                      stopsFilter === opt.value
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                {t("labels.class")}
              </h3>
              <div className="space-y-2">
                {["all", "economy", "business", "first"].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setClassFilter(cls)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 capitalize ${
                      classFilter === cls
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                {t("labels.maxPrice")}: ${maxPrice}
              </h3>
              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-2">
                <span>$100</span>
                <span>$2,000</span>
              </div>
            </div>
          </motion.aside>

          {/* results */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {filteredFlights.length}
                </span>{" "}
                {t("labels.suggestedRoutes")}
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 text-[10px] text-amber-700 font-medium tracking-wide">
                {t("labels.estimatesDisclaimer")}
              </div>
            </div>

            <div className="space-y-6">
              {filteredFlights.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-background border border-border/50 hover:border-primary/50 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-sm font-display font-medium uppercase tracking-tight">
                          {flight.metadata?.airline as string}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {flight.metadata?.flightNumber as string}
                        </span>
                        <span className="ml-auto md:ml-4 text-[10px] uppercase tracking-widest text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-sm">
                          {flight.metadata?.cabinClass as string}
                        </span>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-[80px]">
                          <p className="text-2xl md:text-3xl font-display font-medium tracking-tighter leading-none mb-2">
                            {formatTime(
                              flight.metadata?.departureTime as string,
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                            {flight.metadata?.departureAirport as string}
                          </p>
                        </div>

                        <div className="flex-1 flex flex-col items-center gap-2 px-4">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                            {flight.metadata?.duration as string}
                          </p>
                          <div className="w-full flex items-center gap-2">
                            <div className="flex-1 h-px bg-border/50" />
                            <RiPlaneLine className="w-4 h-4 text-primary rotate-45" />
                            <div className="flex-1 h-px bg-border/50" />
                          </div>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                            {(flight.metadata?.stops as number) === 0
                              ? "Direct"
                              : `${flight.metadata?.stops} stop`}
                          </p>
                        </div>

                        <div className="text-center min-w-[80px]">
                          <p className="text-2xl md:text-3xl font-display font-medium tracking-tighter leading-none mb-2">
                            {formatTime(flight.metadata?.arrivalTime as string)}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                            {flight.metadata?.arrivalAirport as string}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end gap-6 md:gap-4 md:min-w-[180px] border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">
                          Est. Price
                        </p>
                        <p className="text-3xl md:text-4xl font-display font-medium tracking-tighter">
                          {flight.currency} {flight.base_price}
                        </p>
                        <p className="text-[10px] text-muted-foreground italic mt-1">
                          Starting from
                        </p>
                      </div>
                      <div className="w-full md:w-auto">
                        <Link
                          href={`/plan-trip?flight=${flight.id}&from=${flight.metadata?.departureCity}&to=${flight.metadata?.arrivalCity}&depart=${(flight.metadata?.departureTime as string)?.split("T")[0]}`}
                          className="flex items-center justify-center w-full bg-foreground hover:bg-primary text-background hover:text-primary-foreground rounded-full py-3 px-6 text-center font-display font-medium uppercase tracking-widest text-[10px] transition-all duration-300"
                        >
                          {t("labels.requestQuote")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredFlights.length === 0 && (
                <div className="text-center py-32 border-2 border-dashed border-border/50 rounded-3xl">
                  <RiPlaneLine className="w-16 h-16 mx-auto mb-6 text-muted-foreground/20" />
                  <p className="font-display text-2xl font-medium uppercase tracking-tight">
                    {t("labels.noFlights")}
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {t("labels.tryAdjusting")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
