"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiSearchLine, RiFilterOffLine } from "@remixicon/react";
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
              placeholder="Search hotels..."
              value={hotelSearch}
              onChange={(e) => setHotelSearch(e.target.value)}
              className="pl-9 h-9 bg-white"
            />
          </div>

          <Select
            value={hotelPriceFilter}
            onValueChange={(val) =>
              setHotelPriceFilter(val as FilterState["priceRange"])
            }
          >
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="budget">Under $150</SelectItem>
              <SelectItem value="mid">$150 - $200</SelectItem>
              <SelectItem value="luxury">$200+</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={hotelStarsFilter}
            onValueChange={(val) =>
              setHotelStarsFilter(val as FilterState["stars"])
            }
          >
            <SelectTrigger className="w-[130px] bg-white">
              <SelectValue placeholder="Stars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4+">4+ Stars</SelectItem>
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
          {/* search */}
          <div className="relative flex-1 min-w-[180px]">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={carSearch}
              onChange={(e) => setCarSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>

          <Select
            value={carCategoryFilter}
            onValueChange={(val) =>
              setCarCategoryFilter(val as FilterState["category"])
            }
          >
            <SelectTrigger className="w-[130px] bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
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
