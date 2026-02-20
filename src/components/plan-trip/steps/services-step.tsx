"use client";

import { motion } from "motion/react";
import {
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiCheckDoubleLine,
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
  TripItem,
  Hotel,
  Car,
  Guide,
  FilterState,
} from "@/lib/plan_trip-types";
import { DRIVER_SURCHARGE } from "@/lib/configs";
import { useTranslations } from "next-intl";
import { ServiceItem } from "@/components/service-item";
import type { ServiceResponse } from "@/lib/schema/service-schema";
import { useState } from "react";

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
  aiRecommendations,
  onClearAi,
}: ServicesStepProps & {
  aiRecommendations: {
    destination: string;
    itinerarySummary: string;
    hotels: Hotel[];
    cars: Car[];
    guides: Guide[];
  } | null;
  onClearAi: () => void;
}) {
  const t = useTranslations("PlanTrip.addOns");

  const hotelItem = items.find((i) => i.type === "hotel");
  const carItem = items.find((i) => i.type === "car");
  const guideItem = items.find((i) => i.type === "guide");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [conflictItem, setConflictItem] = useState<{
    newItem: TripItem;
    existingItem: TripItem;
  } | null>(null);

  const handleSelectHotel = (hotel: Hotel) => {
    // If exact same item is selected, do nothing (or toggle off, but "Remove" button handles that)
    if (hotelItem?.id === hotel.id) return;

    const newItem: TripItem = {
      id: hotel.id,
      type: "hotel",
      title: hotel.name,
      description: hotel.location,
      price: hotel.pricePerNight * days,
      data: hotel,
      quantity: 1,
    };

    if (hotelItem) {
      // Conflict! Ask user.
      setConflictItem({ newItem, existingItem: hotelItem });
    } else {
      addItem(newItem);
    }
  };

  const handleConfirmReplace = () => {
    if (!conflictItem) return;
    removeItem(conflictItem.existingItem.id);
    addItem(conflictItem.newItem);
    setConflictItem(null);
  };

  const handleConfirmAdd = () => {
    if (!conflictItem) return;
    addItem(conflictItem.newItem);
    setConflictItem(null);
  };

  const handleSelectAllAi = () => {
    if (!aiRecommendations) return;

    // Add Hotels
    aiRecommendations.hotels.forEach((h) => {
      // Simple check to avoid exact ID duplicates being added blindly if they exist
      const exists = items.find((i) => i.id === h.id);
      if (!exists) {
        addItem({
          id: h.id,
          type: "hotel",
          title: h.name,
          description: h.location,
          price: h.pricePerNight * days,
          data: h,
          quantity: 1,
        });
      }
    });

    // Add Cars
    aiRecommendations.cars.forEach((c) => {
      const exists = items.find((i) => i.id === c.id);
      if (!exists) {
        addItem({
          id: c.id,
          type: "car",
          title: c.model,
          description: `${c.category}`,
          price:
            c.pricePerDay * days + (c.withDriver ? DRIVER_SURCHARGE * days : 0),
          data: c,
          quantity: 1,
        });
      }
    });

    // Add Guides
    aiRecommendations.guides.forEach((g) => {
      const exists = items.find((i) => i.id === g.id);
      if (!exists) {
        addItem({
          id: g.id,
          type: "guide",
          title: g.name,
          description: g.description,
          price: g.price, // Assuming daily rate or flat fee
          data: g,
          quantity: 1,
        });
      }
    });
  };

  const handleSelectCar = (car: Car) => {
    // Same car selected?
    if (carItem?.id === car.id) return;

    const newItem: TripItem = {
      id: car.id,
      type: "car",
      title: car.model,
      description: `${car.category} - ${car.transmission}`,
      price:
        car.pricePerDay * days + (car.withDriver ? DRIVER_SURCHARGE * days : 0),
      data: car,
      quantity: 1,
    };

    if (carItem) {
      setConflictItem({ newItem, existingItem: carItem });
    } else {
      addItem(newItem);
    }
  };

  const handleCarDriverChange = (withDriver: boolean) => {
    if (!carItem) return;
    const car = carItem.data as Car & { withDriver?: boolean };
    const pricePerDay = car.pricePerDay || 0;
    const newPrice = (pricePerDay + (withDriver ? DRIVER_SURCHARGE : 0)) * days;

    updateItem(carItem.id, {
      price: newPrice,
      data: { ...car, withDriver },
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
        quantity: 1,
      });
    }
  };

  if (aiRecommendations) {
    // Adapt to ServiceResponse
    const aiServices: ServiceResponse[] = [
      ...aiRecommendations.hotels.map((h) => ({
        id: h.id,
        title: h.name,
        service_type: "hotel",
        description: h.location + " · " + h.amenities.slice(0, 3).join(", "), // simplified description
        base_price: h.pricePerNight,
        currency: "USD",
        capacity: 2,
        status: "active",
        media: h.image
          ? [{ id: 1, media_url: h.image, media_type: "image", sort_order: 1 }]
          : [],
        user: "ai",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      ...aiRecommendations.cars.map((c) => ({
        id: c.id,
        title: c.model,
        service_type: "car",
        description: `${c.category} · ${c.transmission} · ${c.seats} seats`,
        base_price: c.pricePerDay,
        currency: "USD",
        capacity: c.seats,
        status: "active",
        media: c.image
          ? [{ id: 1, media_url: c.image, media_type: "image", sort_order: 1 }]
          : [],
        user: "ai",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      ...aiRecommendations.guides.map((g) => ({
        id: g.id,
        title: g.name,
        service_type: "guide",
        description: `${g.type} · ${g.description}`,
        base_price: g.price || 0,
        currency: "USD",
        capacity: 10,
        status: "active",
        media: g.image
          ? [{ id: 1, media_url: g.image, media_type: "image", sort_order: 1 }]
          : [],
        user: "ai",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    ];

    return (
      <motion.div
        key="step3-ai"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-8"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display uppercase tracking-wider text-primary">
                AI Recommendations
              </h3>
              <p className="text-muted-foreground text-sm max-w-2xl">
                {aiRecommendations.itinerarySummary}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSelectAllAi}
                className="shrink-0 gap-2"
              >
                <RiCheckDoubleLine className="size-4" />
                Add All Results
              </Button>
              <Button variant="ghost" onClick={onClearAi} className="shrink-0">
                View Full Catalog
              </Button>
            </div>
          </div>

          <div className="border-t border-border">
            {aiServices.map((service) => (
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
                isSelected={!!items.find((i) => i.id === String(service.id))}
                onSelect={(s) => {
                  const price =
                    typeof s.base_price === "string"
                      ? parseFloat(s.base_price)
                      : s.base_price;

                  // If already selected, remove it
                  const existing = items.find((i) => i.id === String(s.id));
                  if (existing) {
                    removeItem(existing.id);
                    return;
                  }

                  if (s.service_type === "hotel") {
                    handleSelectHotel({
                      id: String(s.id),
                      name: s.title,
                      location:
                        typeof s.location === "string" ? s.location : "",
                      pricePerNight: price,
                      address: s.description || "",
                      rating: 4.5,
                      image: s.media?.[0]?.media_url || "",
                      amenities: [],
                      stars: 4,
                    } as Hotel);
                  } else if (
                    s.service_type === "car" ||
                    s.service_type === "car_rental"
                  ) {
                    handleSelectCar({
                      id: String(s.id),
                      model: s.title,
                      category: "suv",
                      transmission: "Automatic",
                      seats: s.capacity,
                      pricePerDay: price,
                      fuelType: "Petrol",
                      image: s.media?.[0]?.media_url || "",
                      features: [],
                    } as Car);
                  } else if (s.service_type === "guide") {
                    const newItem: TripItem = {
                      id: String(s.id),
                      type: "guide",
                      title: s.title,
                      description: s.description,
                      price: price,
                      data: { ...s },
                      quantity: 1,
                    };
                    addItem(newItem);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

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
