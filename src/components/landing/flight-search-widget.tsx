"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  RiCalendarLine,
  RiUserLine,
  RiSearchLine,
  RiArrowLeftRightLine,
  RiAddLine,
  RiSubtractLine,
  RiFlightTakeoffLine,
  RiFlightLandLine,
} from "@remixicon/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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

export function FlightSearchWidget() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Common");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("Kigali (KGL)");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const totalPax = adults + children + infants;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (departDate) params.set("depart", departDate);
    if (returnDate) params.set("return", returnDate);
    params.set("adults", adults.toString());
    if (children > 0) params.set("children", children.toString());
    if (infants > 0) params.set("infants", infants.toString());
    router.push(
      `/${locale}/plan-trip?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&depart=${departDate}&return=${returnDate}&adults=${adults}${children > 0 ? `&children=${children}` : ""}${infants > 0 ? `&infants=${infants}` : ""}`,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
      className="w-full"
    >
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-sm p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end">
          <div className="md:col-span-3">
            <label
              htmlFor="flight-from"
              className="block text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-2 font-display"
            >
              From
            </label>
            <div className="relative">
              <RiFlightTakeoffLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
              <input
                id="flight-from"
                type="text"
                placeholder="City or airport"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                list="departure-cities"
                className="w-full bg-white/5 border border-white/10 text-primary-foreground placeholder:text-primary-foreground/30 rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
              <datalist id="departure-cities">
                {POPULAR_DESTINATIONS.map((d) => (
                  <option key={d.code} value={`${d.city} (${d.code})`} />
                ))}
              </datalist>
            </div>
          </div>

          {/* swap button (desktop only) */}
          <div className="hidden md:flex md:col-span-1 justify-center pb-2">
            <button
              type="button"
              onClick={() => {
                const temp = from;
                setFrom(to);
                setTo(temp);
              }}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-primary-foreground/40 hover:text-primary-foreground hover:border-white/30 transition-colors"
            >
              <RiArrowLeftRightLine className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="flight-to"
              className="block text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-2 font-display"
            >
              To
            </label>
            <div className="relative">
              <RiFlightLandLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
              <input
                id="flight-to"
                type="text"
                placeholder="Kigali (KGL)"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                list="arrival-cities"
                className="w-full bg-white/5 border border-white/10 text-primary-foreground placeholder:text-primary-foreground/30 rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
              <datalist id="arrival-cities">
                {POPULAR_DESTINATIONS.map((d) => (
                  <option key={d.code} value={`${d.city} (${d.code})`} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="flight-depart"
              className="block text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-2 font-display"
            >
              Depart
            </label>
            <div className="relative">
              <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
              <input
                id="flight-depart"
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-primary-foreground rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors scheme-dark"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="flight-return"
              className="block text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-2 font-display"
            >
              Return
            </label>
            <div className="relative">
              <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
              <input
                id="flight-return"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-primary-foreground rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors scheme-dark"
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <label
              htmlFor="flight-pax"
              className="block text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-2 font-display"
            >
              Pax
            </label>
            <div className="relative">
              <Popover>
                <PopoverTrigger className="w-full bg-white/5 border border-white/10 text-primary-foreground rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors text-left flex items-center cursor-pointer">
                  <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                  <span className="truncate">
                    {totalPax} Traveler{totalPax > 1 ? "s" : ""}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-black/90 border-white/10 backdrop-blur-xl p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">
                          Adults
                        </div>
                        <div className="text-xs text-white/50">Ages 12+</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10 hover:text-white"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >
                          <RiSubtractLine className="h-4 w-4" />
                        </Button>
                        <span className="text-sm w-4 text-center text-white">
                          {adults}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10 hover:text-white"
                          onClick={() => setAdults(Math.min(9, adults + 1))}
                          disabled={adults >= 9}
                        >
                          <RiAddLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">
                          Children
                        </div>
                        <div className="text-xs text-white/50">Ages 2-11</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10 hover:text-white"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                        >
                          <RiSubtractLine className="h-4 w-4" />
                        </Button>
                        <span className="text-sm w-4 text-center text-white">
                          {children}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10 hover:text-white"
                          onClick={() => setChildren(Math.min(9, children + 1))}
                          disabled={children >= 9}
                        >
                          <RiAddLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">
                          Infants
                        </div>
                        <div className="text-xs text-white/50">Ages 0-2</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10 hover:text-white"
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          disabled={infants <= 0}
                        >
                          <RiSubtractLine className="h-4 w-4" />
                        </Button>
                        <span className="text-sm w-4 text-center text-white">
                          {infants}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10 hover:text-white"
                          onClick={() =>
                            setInfants(
                              Math.min(Math.min(9, adults), infants + 1),
                            )
                          }
                          disabled={infants >= adults} // Limit infants to number of adults usually
                        >
                          <RiAddLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* search button */}
          <div className="md:col-span-1 md:self-end">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full bg-primary hover:bg-primary-light text-primary-foreground rounded-sm py-3 px-4 flex items-center justify-center gap-2 transition-colors font-display font-medium uppercase tracking-wider text-xs"
            >
              <RiSearchLine className="w-4 h-4" />
              <span className="md:hidden">{t("submit")}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
