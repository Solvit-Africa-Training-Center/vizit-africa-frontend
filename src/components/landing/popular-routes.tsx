"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import { SectionTitle } from "./section-title";
import { RiPlaneLine, RiTimeLine, RiArrowRightLine } from "@remixicon/react";

const ROUTES = [
  {
    id: 1,
    from: "London",
    fromCode: "LHR",
    to: "Kigali",
    toCode: "KGL",
    airline: "RwandAir",
    duration: "8h 30m",
    stops: 0,
    price: 485,
  },
  {
    id: 2,
    from: "Dubai",
    fromCode: "DXB",
    to: "Kigali",
    toCode: "KGL",
    airline: "RwandAir",
    duration: "6h 15m",
    stops: 0,
    price: 395,
  },
  {
    id: 3,
    from: "Nairobi",
    fromCode: "NBO",
    to: "Kigali",
    toCode: "KGL",
    airline: "RwandAir",
    duration: "1h 15m",
    stops: 0,
    price: 285,
  },
  {
    id: 4,
    from: "Amsterdam",
    fromCode: "AMS",
    to: "Kigali",
    toCode: "KGL",
    airline: "KLM",
    duration: "9h 45m",
    stops: 0,
    price: 520,
  },
  {
    id: 5,
    from: "Istanbul",
    fromCode: "IST",
    to: "Kigali",
    toCode: "KGL",
    airline: "Turkish Airlines",
    duration: "7h 20m",
    stops: 0,
    price: 445,
  },
  {
    id: 6,
    from: "Addis Ababa",
    fromCode: "ADD",
    to: "Kigali",
    toCode: "KGL",
    airline: "Ethiopian Airlines",
    duration: "2h 30m",
    stops: 0,
    price: 245,
  },
];

export function PopularRoutes() {
  const t = useTranslations("PopularRoutes");
  const router = useRouter();
  const locale = useLocale();

  const handleRouteClick = (route: (typeof ROUTES)[number]) => {
    const params = new URLSearchParams();
    params.set("from", `${route.from} (${route.fromCode})`);
    params.set("to", `${route.to} (${route.toCode})`);
    router.push(`/${locale}/flights?${params.toString()}`);
  };

  return (
    <div>
      <SectionTitle
        overline={t("overline")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
        {ROUTES.map((route, index) => (
          <motion.button
            key={route.id}
            type="button"
            onClick={() => handleRouteClick(route)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-background border border-border hover:border-primary/30 rounded-sm p-6 text-left transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg uppercase tracking-tight">
                  {route.fromCode}
                </span>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <div className="w-2 h-px bg-border" />
                  <RiPlaneLine className="w-4 h-4 text-primary rotate-45" />
                  <div className="w-2 h-px bg-border" />
                </div>
                <span className="font-display font-bold text-lg uppercase tracking-tight">
                  {route.toCode}
                </span>
              </div>
              <RiArrowRightLine className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {route.from} → {route.to}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <RiTimeLine className="w-3 h-3" />
                    {route.duration}
                  </span>
                  <span className="text-primary/80 font-medium">
                    {route.stops === 0 ? t("direct") : t("oneStop")}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{route.airline}</p>
                <p className="font-display font-bold text-lg">${route.price}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
