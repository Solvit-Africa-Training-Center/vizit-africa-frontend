"use client";

import { motion } from "motion/react";
import { RiHotelLine, RiCarLine, RiUserStarLine } from "@remixicon/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  HotelCard,
  CarCard,
  GuideCard,
  InlineFilters,
  Pagination,
} from "@/components/plan-trip";
import { DRIVER_SURCHARGE } from "@/lib/configs";
import type {
  TripItem,
  Hotel,
  Car,
  Guide,
  FilterState,
} from "@/lib/plan_trip-types";

interface ServicesCatalogProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  hotelCount: number;
  carCount: number;
  paginatedHotels: Hotel[];
  paginatedCars: Car[];
  hotelPage: number;
  setHotelPage: (page: number) => void;
  hotelTotalPages: number;
  carPage: number;
  setCarPage: (page: number) => void;
  carTotalPages: number;
  guides: Guide[];
  hotelItem?: TripItem;
  carItem?: TripItem;
  guideItem?: TripItem;
  days: number;
  handleSelectHotel: (hotel: Hotel) => void;
  handleSelectCar: (car: Car) => void;
  handleCarDriverChange: (withDriver: boolean) => void;
  handleToggleGuide: (guide: Guide) => void;
}

export function ServicesCatalog({
  activeTab,
  setActiveTab,
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
  paginatedHotels,
  paginatedCars,
  hotelPage,
  setHotelPage,
  hotelTotalPages,
  carPage,
  setCarPage,
  carTotalPages,
  guides,
  hotelItem,
  carItem,
  guideItem,
  days,
  handleSelectHotel,
  handleSelectCar,
  handleCarDriverChange,
  handleToggleGuide,
}: ServicesCatalogProps) {
  return (
    <motion.div
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
              Hotels
            </TabsTrigger>
            <TabsTrigger
              value="cars"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 text-base font-display font-medium uppercase tracking-wide"
            >
              <RiCarLine className="size-4 mr-2" />
              Cars
            </TabsTrigger>
            <TabsTrigger
              value="guides"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 text-base font-display font-medium uppercase tracking-wide"
            >
              <RiUserStarLine className="size-4 mr-2" />
              Guides
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="space-y-6">
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
                No hotels found matching your filters.
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
                No cars found matching your filters.
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
                      withDriver={
                        carItem?.id === car.id
                          ? carItem.data?.withDriver
                          : false
                      }
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
                We recommend having a guide for the best experience.
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
      </Tabs>
    </motion.div>
  );
}
