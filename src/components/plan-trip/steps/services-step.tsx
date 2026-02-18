"use client";

import { motion } from "motion/react";
import { RiHotelLine, RiCarLine, RiUserStarLine } from "@remixicon/react";

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
  TripItem,
  Hotel,
  Car,
  Guide,
  FilterState,
} from "@/lib/plan_trip-types";
import { DRIVER_SURCHARGE } from "@/lib/configs";
import { useTranslations } from "next-intl";

interface ServicesStepProps {
  items: TripItem[];
  addItem: (item: TripItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<TripItem>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showMobileSummary: boolean;
  setShowMobileSummary: (show: boolean) => void;

  tripInfo: TripInfo;
  days: number;
  total: number;
  travelers: number;
  subtotal: number;
  serviceFee: number;

  paginatedHotels: Hotel[];
  paginatedCars: Car[];
  hotelTotalPages: number;
  carTotalPages: number;
  hotelCount: number;
  carCount: number;

  hotelPage: number;
  setHotelPage: (page: number) => void;
  carPage: number;
  setCarPage: (page: number) => void;

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

  guides: Guide[];
}

export function ServicesStep({
  items,
  addItem,
  removeItem,
  updateItem,
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
  guides,
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
}: ServicesStepProps) {
  const t = useTranslations("PlanTrip.addOns");

  const hotelItem = items.find(i => i.type === "hotel");
  const carItem = items.find(i => i.type === "car");
  const guideItem = items.find(i => i.type === "guide");

  const handleSelectHotel = (hotel: Hotel) => {
    if (hotelItem?.id === hotel.id) return; // already selected
    
    if (hotelItem) {
        removeItem(hotelItem.id);
    }
    
    addItem({
        id: hotel.id,
        type: "hotel",
        title: hotel.name,
        description: hotel.location,
        price: hotel.pricePerNight * days,
        data: hotel,
        quantity: 1
    });
  };

  const handleSelectCar = (car: Car) => {
    if (carItem?.id === car.id) return;

    if (carItem) {
        removeItem(carItem.id);
    }

    const withDriver = false;
    addItem({
        id: car.id,
        type: "car",
        title: car.model,
        description: `${car.seats} seats · ${car.transmission}`,
        price: car.pricePerDay * days,
        data: { ...car, withDriver },
        quantity: 1
    });
  };

  const handleCarDriverChange = (withDriver: boolean) => {
    if (!carItem) return;
    const car = carItem.data as Car & { withDriver?: boolean };
    const pricePerDay = car.pricePerDay || 0;
    const newPrice = (pricePerDay + (withDriver ? DRIVER_SURCHARGE : 0)) * days;

    updateItem(carItem.id, {
        price: newPrice,
        data: { ...car, withDriver }
    });
  };

  const handleToggleGuide = (guide: Guide) => {
      const currentGuideId = guideItem?.id;
      if (currentGuideId === guide.id && currentGuideId) {
          removeItem(currentGuideId);
      } else {
          if (guideItem) removeItem(guideItem.id); 
          
          addItem({
              id: guide.id,
              type: "guide",
              title: guide.name,
              description: "Professional Guide",
              price: guide.price,
              data: guide,
              quantity: 1
          });
      }
  };


  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-6 mb-8">
          <TabsList className="w-full border-b border-border">
            <TabsTrigger
              value="hotels"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 text-base font-display font-medium uppercase tracking-wide"
            >
              <RiHotelLine className="size-4 mr-2" />
              {t("tabs.hotels")}
            </TabsTrigger>
            <TabsTrigger
              value="cars"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 text-base font-display font-medium uppercase tracking-wide"
            >
              <RiCarLine className="size-4 mr-2" />
              {t("tabs.cars")}
            </TabsTrigger>
            <TabsTrigger
              value="guides"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 text-base font-display font-medium uppercase tracking-wide"
            >
              <RiUserStarLine className="size-4 mr-2" />
              {t("tabs.guides")}
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
                  items={items}
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

        <div className="space-y-6">
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
                <div className="text-center py-12 text-muted-foreground bg-primary-foreground border rounded-xl">
                  {t("noHotels")}
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {paginatedHotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        isSelected={hotelItem?.id === hotel.id}
                        days={days}
                        onSelect={() => handleSelectHotel(hotel)}
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
                <div className="text-center py-12 text-muted-foreground bg-primary-foreground border rounded-xl">
                  {t("noCars")}
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {paginatedCars.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        isSelected={carItem?.id === car.id}
                        days={days}
                        withDriver={carItem?.id === car.id ? carItem.data?.withDriver : false}
                        driverSurcharge={DRIVER_SURCHARGE}
                        onSelect={() => handleSelectCar(car)}
                        onDriverChange={handleCarDriverChange}
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
                  {t("guidesAlert")}
                </AlertDescription>
              </Alert>
              <div className="grid sm:grid-cols-2 gap-3">
                {guides.map((guide) => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    isSelected={guideItem?.id === guide.id}
                    onToggle={() => handleToggleGuide(guide)}
                  />
                ))}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </motion.div>
  );
}
