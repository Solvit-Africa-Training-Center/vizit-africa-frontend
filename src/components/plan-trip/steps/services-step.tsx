"use client";

import { motion } from "motion/react";
import {
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiArrowLeftLine,
  RiArrowRightLine,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  HotelCard,
  CarCard,
  GuideCard,
  InlineFilters,
  Pagination,
  BookingSummary,
} from "@/components/plan-trip";
import type {
  TripInfo,
  Selections,
  Hotel,
  Car,
  Guide,
  FilterState,
} from "@/lib/plan_trip-types";
import { MOCK_GUIDES, DRIVER_SURCHARGE } from "@/lib/plan-trip-data";
import { useState } from "react";

interface ServicesStepProps {
  // State
  selections: Selections;
  setSelections: (selections: Selections) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showMobileSummary: boolean;
  setShowMobileSummary: (show: boolean) => void;

  // Data
  tripInfo: TripInfo;
  days: number;
  total: number;
  travelers: number;
  subtotal: number;
  serviceFee: number;

  // Filtered Data
  paginatedHotels: Hotel[];
  paginatedCars: Car[];
  hotelTotalPages: number;
  carTotalPages: number;
  hotelCount: number;
  carCount: number;

  // Filter Actions
  hotelSearch: string;
  setHotelSearch: (s: string) => void;
  hotelPriceFilter: FilterState["priceRange"];
  setHotelPriceFilter: (s: FilterState["priceRange"]) => void;
  hotelStarsFilter: FilterState["stars"];
  setHotelStarsFilter: (s: FilterState["stars"]) => void;
  carSearch: string;
  setCarSearch: (s: string) => void;
  carCategoryFilter: FilterState["category"];
  setCarCategoryFilter: (s: FilterState["category"]) => void;

  // Pagination Actions
  hotelPage: number;
  setHotelPage: (page: number) => void;
  carPage: number;
  setCarPage: (page: number) => void;

  // Navigation
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function ServicesStep({
  selections,
  setSelections,
  activeTab,
  setActiveTab,
  showMobileSummary,
  setShowMobileSummary,
  tripInfo,
  days,
  total,
  travelers,
  subtotal,
  serviceFee,
  paginatedHotels,
  paginatedCars,
  hotelTotalPages,
  carTotalPages,
  hotelCount,
  carCount,
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
  hotelPage,
  setHotelPage,
  carPage,
  setCarPage,
  onNext,
  onBack,
  canProceed,
}: ServicesStepProps) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between gap-4 mb-6">
          <TabsList className="border">
            <TabsTrigger value="hotels" className="">
              <RiHotelLine className="size-4" />
              <span className="hidden sm:inline">Hotels</span>
            </TabsTrigger>
            <TabsTrigger value="cars" className="">
              <RiCarLine className="size-4" />
              <span className="hidden sm:inline">Cars</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="">
              <RiUserStarLine className="size-4" />
              <span className="hidden sm:inline">Guides</span>
            </TabsTrigger>
          </TabsList>

          <div className="lg:hidden">
            <Sheet open={showMobileSummary} onOpenChange={setShowMobileSummary}>
              <SheetTrigger render={<Button variant="outline" size="sm" />}>
                ${total.toFixed(0)}
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <BookingSummary
                  currentStep={3}
                  tripInfo={tripInfo}
                  selections={selections}
                  days={days}
                  travelers={travelers}
                  driverSurcharge={DRIVER_SURCHARGE}
                  subtotal={subtotal}
                  serviceFee={serviceFee}
                  total={total}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          <div>
            <InlineFilters
              activeTab={activeTab}
              hotelSearch={hotelSearch}
              setHotelSearch={setHotelSearch}
              hotelPriceFilter={hotelPriceFilter}
              setHotelPriceFilter={setHotelPriceFilter}
              hotelStarsFilter={hotelStarsFilter}
              setHotelStarsFilter={setHotelStarsFilter}
              carSearch={carSearch}
              setCarSearch={setCarSearch}
              carCategoryFilter={carCategoryFilter}
              setCarCategoryFilter={setCarCategoryFilter}
              hotelCount={hotelCount}
              carCount={carCount}
            />

            <TabsContent value="hotels" className="mt-0">
              {paginatedHotels.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-white border rounded-xl">
                  No hotels match your filters
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {paginatedHotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        isSelected={selections.hotel?.id === hotel.id}
                        days={days}
                        onSelect={() => setSelections({ ...selections, hotel })}
                      />
                    ))}
                  </div>
                  <Pagination
                    currentPage={hotelPage}
                    totalPages={hotelTotalPages}
                    onPageChange={setHotelPage}
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="cars" className="mt-0">
              {paginatedCars.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-white border rounded-xl">
                  No vehicles match your filters
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {paginatedCars.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        isSelected={selections.car?.id === car.id}
                        days={days}
                        withDriver={selections.carWithDriver}
                        driverSurcharge={DRIVER_SURCHARGE}
                        onSelect={() => setSelections({ ...selections, car })}
                        onDriverChange={(withDriver) =>
                          setSelections({
                            ...selections,
                            carWithDriver: withDriver,
                          })
                        }
                      />
                    ))}
                  </div>
                  <Pagination
                    currentPage={carPage}
                    totalPages={carTotalPages}
                    onPageChange={setCarPage}
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="guides" className="mt-0">
              <Alert className="mb-3 bg-primary-subtle border-primary/20">
                <AlertDescription className="text-foreground">
                  Guides are optional but highly recommended for first-time
                  visitors!
                </AlertDescription>
              </Alert>
              <div className="grid sm:grid-cols-2 gap-3">
                {MOCK_GUIDES.map((guide) => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    isSelected={selections.guide?.id === guide.id}
                    onToggle={() =>
                      setSelections({
                        ...selections,
                        guide: selections.guide?.id === guide.id ? null : guide,
                      })
                    }
                  />
                ))}
              </div>
            </TabsContent>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <RiArrowLeftLine /> Back
              </Button>
              <Button size="lg" disabled={!canProceed} onClick={onNext}>
                Review Booking
                <RiArrowRightLine />
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <BookingSummary
              currentStep={3}
              tripInfo={tripInfo}
              selections={selections}
              days={days}
              travelers={travelers}
              driverSurcharge={DRIVER_SURCHARGE}
              subtotal={subtotal}
              serviceFee={serviceFee}
              total={total}
            />
          </div>
        </div>
      </Tabs>
    </motion.div>
  );
}
