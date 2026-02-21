"use client";

import { RiFilterOffLine, RiSearchLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterState } from "@/lib/plan_trip-types";

interface InlineFiltersProps {
  activeTab: string;
  hotelSearch: string;
  setHotelSearch: (v: string) => void;
  hotelPriceFilter: FilterState["priceRange"];
  setHotelPriceFilter: (v: FilterState["priceRange"]) => void;
  hotelStarsFilter: FilterState["stars"];
  setHotelStarsFilter: (v: FilterState["stars"]) => void;
  carSearch: string;
  setCarSearch: (v: string) => void;
  carCategoryFilter: FilterState["category"];
  setCarCategoryFilter: (v: FilterState["category"]) => void;
  hotelCount: number;
  carCount: number;
}

export function InlineFilters({
  activeTab,
  hotelSearch,
  setHotelSearch,
  hotelPriceFilter,
  setHotelPriceFilter,
  hotelStarsFilter,
  setHotelStarsFilter,
  carSearch,
  setCarSearch,
  carCategoryFilter,
  setCarCategoryFilter,
  hotelCount,
  carCount,
}: InlineFiltersProps) {
  const t = useTranslations("PlanTrip.services.filters");

  const hasHotelFilters =
    hotelSearch || hotelPriceFilter !== "all" || hotelStarsFilter !== "all";
  const hasCarFilters = carSearch || carCategoryFilter !== "all";

  const resetHotelFilters = () => {
    setHotelSearch("");
    setHotelPriceFilter("all");
    setHotelStarsFilter("all");
  };

  const resetCarFilters = () => {
    setCarSearch("");
    setCarCategoryFilter("all");
  };

  if (activeTab === "hotels") {
    return (
      <div className=" mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={hotelSearch}
              onChange={(e) => setHotelSearch(e.target.value)}
              className="pl-9 h-9 bg-primary-foreground"
            />
          </div>

          <Select
            value={hotelPriceFilter}
            onValueChange={(val) =>
              setHotelPriceFilter(val as FilterState["priceRange"])
            }
          >
            <SelectTrigger className="w-[140px] bg-primary-foreground">
              <SelectValue placeholder={t("price")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="budget">{t("budget")}</SelectItem>
              <SelectItem value="mid">{t("mid")}</SelectItem>
              <SelectItem value="luxury">{t("luxury")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={hotelStarsFilter}
            onValueChange={(val) =>
              setHotelStarsFilter(val as FilterState["stars"])
            }
          >
            <SelectTrigger className="w-[130px] bg-primary-foreground">
              <SelectValue placeholder={t("stars")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="5">{t("stars5")}</SelectItem>
              <SelectItem value="4+">{t("stars4plus")}</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
            </SelectContent>
          </Select>

          {hasHotelFilters && (
            <Button variant="ghost" size="sm" onClick={resetHotelFilters}>
              <RiFilterOffLine />
              Reset
            </Button>
          )}
          <span className="text-sm text-muted-foreground ml-auto">
            {hotelCount} hotels
          </span>
        </div>
      </div>
    );
  }

  if (activeTab === "cars") {
    return (
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={carSearch}
              onChange={(e) => setCarSearch(e.target.value)}
              className="pl-9 bg-primary-foreground"
            />
          </div>

          <Select
            value={carCategoryFilter}
            onValueChange={(val) =>
              setCarCategoryFilter(val as FilterState["category"])
            }
          >
            <SelectTrigger className="w-[130px] bg-primary-foreground">
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="van">Van</SelectItem>
            </SelectContent>
          </Select>

          {hasCarFilters && (
            <Button variant="ghost" size="sm" onClick={resetCarFilters}>
              <RiFilterOffLine />
              Reset
            </Button>
          )}
          <span className="text-sm text-muted-foreground ml-auto">
            {carCount} vehicles
          </span>
        </div>
      </div>
    );
  }

  return null;
}
