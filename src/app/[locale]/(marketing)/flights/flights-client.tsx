"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  RiFlightTakeoffLine,
  RiFlightLandLine,
  RiSearchLine,
  RiArrowLeftRightLine,
  RiCalendarLine,
  RiUserLine,
  RiPlaneLine,
  RiSortAsc,
} from "@remixicon/react";
import { Link } from "@/i18n/navigation";
import type { ServiceResponse } from "@/lib/schema/service-schema";

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
  const t = useTranslations("Common"); // Adjust if needed

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
      result = result.filter(
        (f) => {
            const depCity = (f.metadata?.departureCity as string)?.toLowerCase() || "";
            const depAirport = (f.metadata?.departureAirport as string)?.toLowerCase() || "";
            return depCity.includes(fromSearch) || depAirport.includes(fromSearch);
        }
      );
    }

    result = result.filter((f) => Number(f.base_price) <= maxPrice);

    if (stopsFilter !== null) {
      result = result.filter((f) => (f.metadata?.stops as number) === stopsFilter);
    }

    if (classFilter !== "all") {
      result = result.filter((f) => (f.metadata?.cabinClass as string) === classFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "price") return Number(a.base_price) - Number(b.base_price);
      if (sortBy === "departure") {
        const timeA = new Date(a.metadata?.departureTime as string || 0).getTime();
        const timeB = new Date(b.metadata?.departureTime as string || 0).getTime();
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
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        {/* search bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 border border-border rounded-sm p-4 md:p-6 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <label
                htmlFor="search-from"
                className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-display"
              >
                From
              </label>
              <div className="relative">
                <RiFlightTakeoffLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="search-from"
                  type="text"
                  placeholder="City or airport"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  list="search-departure"
                  className="w-full bg-background border border-border rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                />
                <datalist id="search-departure">
                  {POPULAR_DESTINATIONS.map((d) => (
                    <option key={d.code} value={`${d.city} (${d.code})`} />
                  ))}
                </datalist>
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
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <RiArrowLeftRightLine className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="md:col-span-3">
              <label
                htmlFor="search-to"
                className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-display"
              >
                To
              </label>
              <div className="relative">
                <RiFlightLandLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="search-to"
                  type="text"
                  placeholder="Kigali (KGL)"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-background border border-border rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="search-depart"
                className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-display"
              >
                Depart
              </label>
              <div className="relative">
                <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="search-depart"
                  type="date"
                  className="w-full bg-background border border-border rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <label
                htmlFor="search-pax"
                className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-display"
              >
                Pax
              </label>
              <div className="relative">
                <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  id="search-pax"
                  className="w-full bg-background border border-border rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-1 md:self-end">
              <button
                type="button"
                className="w-full bg-primary hover:bg-primary-light text-primary-foreground rounded-sm py-3 flex items-center justify-center gap-2 transition-colors font-display font-medium uppercase tracking-wider text-xs"
              >
                <RiSearchLine className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* filters sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-8"
          >
            <div>
              <h3 className="font-display font-medium uppercase tracking-wider text-xs mb-4">
                Sort By
              </h3>
              <div className="space-y-2">
                {(["price", "duration", "departure"] as SortOption[]).map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSortBy(opt)}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                        sortBy === opt
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/50"
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
              <h3 className="font-display font-medium uppercase tracking-wider text-xs mb-4">
                Stops
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
                    className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                      stopsFilter === opt.value
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-medium uppercase tracking-wider text-xs mb-4">
                Class
              </h3>
              <div className="space-y-2">
                {["all", "economy", "business", "first"].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setClassFilter(cls)}
                    className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors capitalize ${
                      classFilter === cls
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-medium uppercase tracking-wider text-xs mb-4">
                Max Price: ${maxPrice}
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
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$100</span>
                <span>$2,000</span>
              </div>
            </div>
          </motion.aside>

          {/* results */}
          <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredFlights.length}
            </span>{" "}
            suggested routes
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-sm px-4 py-2 text-[10px] text-amber-800 font-medium">
            * All flight prices are estimates. We manually find the best real-time options for you.
          </div>
        </div>

            <div className="space-y-4">
              {filteredFlights.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-background border border-border hover:border-primary/30 rounded-sm p-6 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">
                          {flight.metadata?.airline as string}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {flight.metadata?.flightNumber as string}
                        </span>
                        <span className="ml-auto md:ml-2 text-[10px] uppercase tracking-wider text-primary/80 font-medium bg-primary/5 px-2 py-0.5 rounded-sm">
                          {flight.metadata?.cabinClass as string}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-display font-bold tracking-tight">
                            {formatTime(flight.metadata?.departureTime as string)}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {flight.metadata?.departureAirport as string}
                          </p>
                        </div>

                        <div className="flex-1 flex flex-col items-center gap-1 px-4">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {flight.metadata?.duration as string}
                          </p>
                          <div className="w-full flex items-center gap-1">
                            <div className="flex-1 h-px bg-border" />
                            <RiPlaneLine className="w-4 h-4 text-primary rotate-45" />
                            <div className="flex-1 h-px bg-border" />
                          </div>
                          <p className="text-[10px] text-primary/70 font-medium">
                            {(flight.metadata?.stops as number) === 0
                              ? "Direct"
                              : `${flight.metadata?.stops} stop`}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-display font-bold tracking-tight">
                            {formatTime(flight.metadata?.arrivalTime as string)}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {flight.metadata?.arrivalAirport as string}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 md:min-w-[140px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                          Est. Price
                        </p>
                        <p className="text-3xl font-display font-bold">
                          {flight.currency} {flight.base_price}*
                        </p>
                        <p className="text-[10px] text-muted-foreground italic">
                          Starting from
                        </p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto mt-2">
                        <Link
                          href={`/plan-trip?flight=${flight.id}&from=${flight.metadata?.departureCity}&to=${flight.metadata?.arrivalCity}&depart=${(flight.metadata?.departureTime as string)?.split("T")[0]}`}
                          className="w-full bg-primary hover:bg-primary-light text-primary-foreground rounded-sm py-2.5 px-6 text-center font-display font-medium uppercase tracking-wider text-xs transition-colors"
                        >
                          Request Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredFlights.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <RiPlaneLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="font-display text-lg">
                    No flights match your filters
                  </p>
                  <p className="text-sm mt-2">
                    Try adjusting your search criteria
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
