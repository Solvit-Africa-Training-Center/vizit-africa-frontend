"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { RiSearchLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceItem } from "@/components/service-item";
import type { ServiceResponse } from "@/lib/schema/service-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = "all" | "hotel" | "bnb" | "car_rental" | "guide";
type SortOption = "recommended" | "price_asc" | "price_desc" | "az";

interface ServicesClientProps {
  initialServices: ServiceResponse[];
}

const CATEGORY_LABELS: Record<Category, string> = {
  all: "categories.all",
  hotel: "categories.hotels",
  bnb: "categories.bnbs",
  car_rental: "categories.carRentals",
  guide: "categories.guides",
};

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "sortOptions.recommended",
  price_asc: "sortOptions.priceLowHigh",
  price_desc: "sortOptions.priceHighLow",
  az: "sortOptions.az",
};

function getPrice(s: ServiceResponse): number {
  return typeof s.base_price === "string"
    ? Number.parseFloat(s.base_price)
    : s.base_price;
}

export default function ServicesClient({
  initialServices,
}: ServicesClientProps) {
  const t = useTranslations("ServicesPage");

  const categories = Object.entries(CATEGORY_LABELS).map(([value, key]) => ({
    label: t(key),
    value: value as Category,
  }));

  const sortOptions = Object.entries(SORT_LABELS).map(([value, key]) => ({
    label: t(key),
    value: value as SortOption,
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    const result = initialServices.filter((service) => {
      const matchesCategory =
        activeCategory === "all" || service.service_type === activeCategory;
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price_asc") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sortBy === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [searchQuery, activeCategory, sortBy, initialServices]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <PageHeader
        title={t("title")}
        overline={t("overline")}
        description={t("description")}
        className="mb-20"
      />

      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-5 md:px-10 max-w-7xl mx-auto py-4 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <RiSearchLine className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none pl-8 py-2 text-lg focus:ring-0 focus:outline-hidden placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest border transition-all whitespace-nowrap",
                    activeCategory === cat.value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-border hidden md:block" />

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono uppercase text-muted-foreground hidden md:inline">
                {t("sort")}
              </span>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[180px] bg-transparent border-none text-sm font-medium uppercase tracking-wider focus:ring-0 text-foreground ring-0 shadow-none px-0 gap-2">
                  <SelectValue placeholder={t("sort")} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <section className="px-5 md:px-10 max-w-7xl mx-auto py-12 min-h-[50vh]">
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ServiceItem
                  key={String(service.id)}
                  service={service}
                  isExpanded={expandedId === String(service.id)}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === String(service.id)
                        ? null
                        : String(service.id),
                    )
                  }
                  bookLabel={t("bookService")}
                />
              ))
            ) : (
              <div className="py-24 text-center text-muted-foreground text-lg">
                {t("noResults")}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
