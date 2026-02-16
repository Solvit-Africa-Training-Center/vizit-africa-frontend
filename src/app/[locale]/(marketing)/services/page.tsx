"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { RiSearchLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceItem } from "@/components/service-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category =
  | "Flights"
  | "Hotels"
  | "BnBs"
  | "Car Rentals"
  | "Guides"
  | "All";
type SortOption =
  | "Recommended"
  | "Price: Low to High"
  | "Price: High to Low"
  | "A-Z";

export interface Service {
  id: string;
  title: string;
  category: Category;
  description: string;
  price: string;
  image: string;
  details: string[];
}

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");

  const servicesData: Service[] = useMemo(
    () => [
      {
        id: "rwandair-direct",
        title: t("items.rwandair-direct.title"),
        category: "Flights",
        description: t("items.rwandair-direct.description"),
        price: "From $600",
        image: "/images/gradivis.jpg",
        details: [
          t("items.rwandair-direct.details.0"),
          t("items.rwandair-direct.details.1"),
          t("items.rwandair-direct.details.2"),
          t("items.rwandair-direct.details.3"),
        ],
      },
      {
        id: "klm-royal",
        title: t("items.klm-royal.title"),
        category: "Flights",
        description: t("items.klm-royal.description"),
        price: "From $850",
        image: "/images/rwanda-landscape.jpg",
        details: [
          t("items.klm-royal.details.0"),
          t("items.klm-royal.details.1"),
          t("items.klm-royal.details.2"),
          t("items.klm-royal.details.3"),
        ],
      },
      {
        id: "the-retreat",
        title: t("items.the-retreat.title"),
        category: "Hotels",
        description: t("items.the-retreat.description"),
        price: "From $450 / night",
        image: "/images/hotel.jpg",
        details: [
          t("items.the-retreat.details.0"),
          t("items.the-retreat.details.1"),
          t("items.the-retreat.details.2"),
          t("items.the-retreat.details.3"),
        ],
      },
      {
        id: "one-and-only",
        title: t("items.one-and-only.title"),
        category: "Hotels",
        description: t("items.one-and-only.description"),
        price: "From $3,500 / night",
        image: "/images/bed-in-hotel-with-yellowish-lightings.jpg",
        details: [
          t("items.one-and-only.details.0"),
          t("items.one-and-only.details.1"),
          t("items.one-and-only.details.2"),
          t("items.one-and-only.details.3"),
        ],
      },
      {
        id: "kigali-soul",
        title: t("items.kigali-soul.title"),
        category: "BnBs",
        description: t("items.kigali-soul.description"),
        price: "From $80 / night",
        image: "/images/coffee.jpg",
        details: [
          t("items.kigali-soul.details.0"),
          t("items.kigali-soul.details.1"),
          t("items.kigali-soul.details.2"),
          t("items.kigali-soul.details.3"),
        ],
      },
      {
        id: "lavender-home",
        title: t("items.lavender-home.title"),
        category: "BnBs",
        description: t("items.lavender-home.description"),
        price: "From $65 / night",
        image: "/images/agaseke-black-white.jpg",
        details: [
          t("items.lavender-home.details.0"),
          t("items.lavender-home.details.1"),
          t("items.lavender-home.details.2"),
          t("items.lavender-home.details.3"),
        ],
      },
      {
        id: "land-cruiser-v8",
        title: t("items.land-cruiser-v8.title"),
        category: "Car Rentals",
        description: t("items.land-cruiser-v8.description"),
        price: "$150 / day",
        image: "/images/tourism-guide-vehicle-car.jpg",
        details: [
          t("items.land-cruiser-v8.details.0"),
          t("items.land-cruiser-v8.details.1"),
          t("items.land-cruiser-v8.details.2"),
          t("items.land-cruiser-v8.details.3"),
        ],
      },
      {
        id: "rav4-hire",
        title: t("items.rav4-hire.title"),
        category: "Car Rentals",
        description: t("items.rav4-hire.description"),
        price: "$80 / day",
        image: "/images/road-through-hill.jpg",
        details: [
          t("items.rav4-hire.details.0"),
          t("items.rav4-hire.details.1"),
          t("items.rav4-hire.details.2"),
          t("items.rav4-hire.details.3"),
        ],
      },
      {
        id: "guide-alex",
        title: t("items.guide-alex.title"),
        category: "Guides",
        description: t("items.guide-alex.description"),
        price: "$100 / day",
        image: "/images/guide.jpg",
        details: [
          t("items.guide-alex.details.0"),
          t("items.guide-alex.details.1"),
          t("items.guide-alex.details.2"),
          t("items.guide-alex.details.3"),
        ],
      },
      {
        id: "guide-sarah",
        title: t("items.guide-sarah.title"),
        category: "Guides",
        description: t("items.guide-sarah.description"),
        price: "$120 / day",
        image: "/images/woman-tailoring.jpg",
        details: [
          t("items.guide-sarah.details.0"),
          t("items.guide-sarah.details.1"),
          t("items.guide-sarah.details.2"),
          t("items.guide-sarah.details.3"),
        ],
      },
    ],
    [t],
  );

  const categories: { label: string; value: Category }[] = [
    { label: t("categories.all"), value: "All" },
    { label: t("categories.flights"), value: "Flights" },
    { label: t("categories.hotels"), value: "Hotels" },
    { label: t("categories.bnbs"), value: "BnBs" },
    { label: t("categories.carRentals"), value: "Car Rentals" },
    { label: t("categories.guides"), value: "Guides" },
  ];

  const sortOptionsList: { label: string; value: SortOption }[] = [
    { label: t("sortOptions.recommended"), value: "Recommended" },
    { label: t("sortOptions.priceLowHigh"), value: "Price: Low to High" },
    { label: t("sortOptions.priceHighLow"), value: "Price: High to Low" },
    { label: t("sortOptions.az"), value: "A-Z" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Recommended");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    const result = servicesData.filter((service) => {
      const matchesCategory =
        activeCategory === "All" || service.category === activeCategory;
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "Price: Low to High") {
      result.sort(
        (a, b) =>
          parseInt(a.price.replace(/\D/g, ""), 10) -
          parseInt(b.price.replace(/\D/g, ""), 10),
      );
    } else if (sortBy === "Price: High to Low") {
      result.sort(
        (a, b) =>
          parseInt(b.price.replace(/\D/g, ""), 10) -
          parseInt(a.price.replace(/\D/g, ""), 10),
      );
    } else if (sortBy === "A-Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [searchQuery, activeCategory, sortBy, servicesData]);

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
                    <SelectValue placeholder={t("sort")} className={"text-xs"}/>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptionsList.map((opt) => (
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
                    key={service.id}
                    service={service}
                    isExpanded={expandedId === service.id}
                    onToggle={() =>
                      setExpandedId(
                        expandedId === service.id ? null : service.id,
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

