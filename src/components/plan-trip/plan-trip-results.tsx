"use client";

import { RiCheckDoubleLine, RiLoader4Line } from "@remixicon/react";
import { useState } from "react";
import {
  AiLoading,
  AiResultsList,
  BookingSummary,
  ServicesCatalog,
} from "@/components/plan-trip";
import { ConflictDialog } from "@/components/plan-trip/conflict-dialog";
import { ContactInfoStep } from "@/components/plan-trip/contact-info";
import type { UsePlanTripReturn } from "@/hooks/use-plan-trip";
import type { UseTripFormReturn } from "@/hooks/use-trip-form";
import { Button } from "@/components/ui/button";
import { DRIVER_SURCHARGE } from "@/lib/configs";
import type { Car, Guide, Hotel, TripItem } from "@/lib/plan_trip-types";

interface PlanTripResultsProps {
  activeRecommendations: {
    destination: string;
    itinerarySummary: string;
    totalEstimatedBudget: number;
    hotels: Hotel[];
    cars: Car[];
    guides: Guide[];
  };
  onClearAi: () => void;
  planTrip: UsePlanTripReturn;
  form: UseTripFormReturn;
  handleSubmit: () => void;
  isGenerating?: boolean;
}

export function PlanTripResults({
  activeRecommendations,
  onClearAi,
  planTrip,
  form,
  handleSubmit,
  isGenerating = false,
}: PlanTripResultsProps) {
  const [conflictItem, setConflictItem] = useState<{
    newItem: TripItem;
    existingItem: TripItem;
  } | null>(null);

  const {
    items,
    addItem,
    removeItem,
    updateItem,
    activeTab,
    setActiveTab,
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
    filteredHotels,
    filteredCars,
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
    initialGuides,
  } = planTrip;

  const hotelItem = items.find((i: TripItem) => i.type === "hotel");
  const carItem = items.find((i: TripItem) => i.type === "car");
  const guideItem = items.find((i: TripItem) => i.type === "guide");

  const handleSelectHotel = (hotel: Hotel) => {
    if (hotelItem?.id === String(hotel.id)) return;
    const newItem: TripItem = {
      id: String(hotel.id),
      type: "hotel",
      title: hotel.name || hotel.title,
      description: hotel.location,
      price: (hotel.pricePerNight || hotel.price) * days,
      data: hotel,
      quantity: 1,
      startDate: tripInfo.arrivalDate,
      endDate: tripInfo.departureDate,
    };
    if (hotelItem) {
      setConflictItem({ newItem, existingItem: hotelItem });
    } else {
      addItem(newItem);
    }
  };

  const handleSelectCar = (car: Car) => {
    if (carItem?.id === String(car.id)) return;
    const price = car.pricePerDay || car.price || 0;
    const newItem: TripItem = {
      id: String(car.id),
      type: "car",
      title: car.model || car.title,
      description: `${car.category || "Standard"}`,
      price:
        price * days + (car.withDriver ? DRIVER_SURCHARGE * days : 0),
      data: car,
      quantity: 1,
      startDate: tripInfo.arrivalDate,
      endDate: tripInfo.departureDate,
      withDriver: !!(tripInfo.needsCar && tripInfo.carTypePreference === car.category),
      metadata: {
        category: car.category,
        transmission: car.transmission,
        fuelType: car.fuelType,
      },
    };
    if (carItem) {
      setConflictItem({ newItem, existingItem: carItem });
    } else {
      addItem(newItem);
    }
  };

  const handleConfirmConflict = () => {
    if (!conflictItem) return;
    removeItem(conflictItem.existingItem.id);
    addItem(conflictItem.newItem);
    setConflictItem(null);
  };

  const handleCarDriverChange = (withDriver: boolean) => {
    if (!carItem) return;
    const car = carItem.data as Car;
    const pricePerDay = car.pricePerDay || car.price || 0;
    const newPrice = (pricePerDay + (withDriver ? DRIVER_SURCHARGE : 0)) * days;
    updateItem(carItem.id, {
      price: newPrice,
      withDriver,
      data: { ...car, withDriver },
    });
  };

  const handleToggleGuide = (guide: Guide) => {
    if (guideItem?.id === String(guide.id)) {
      removeItem(guideItem.id);
    } else {
      if (guideItem) removeItem(guideItem.id);
      addItem({
        id: String(guide.id),
        type: "guide",
        title: guide.name || guide.title,
        description: "Professional Guide",
        price: guide.price,
        data: guide,
        quantity: 1,
        startDate: tripInfo.arrivalDate,
        endDate: tripInfo.departureDate,
        metadata: {
          language: tripInfo.guideLanguages?.[0] || "English",
        },
      });
    }
  };

  const canSubmit = !!(tripInfo.name && tripInfo.email);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-card border border-border p-6 rounded-xl">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-display uppercase tracking-wide">
            Your Itinerary for {activeRecommendations?.destination}
          </h3>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            {activeRecommendations?.itinerarySummary}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isGenerating && <AiLoading compact />}
          <Button
            variant="outline"
            onClick={onClearAi}
            className="w-full sm:w-auto"
          >
            Start Over
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="space-y-12">
          <AiResultsList
            aiRecommendations={activeRecommendations}
            items={items}
            addItem={addItem}
            removeItem={removeItem}
            onClearAi={() => setActiveTab("hotels")}
            handleSelectHotel={handleSelectHotel}
            handleSelectCar={handleSelectCar}
            days={days}
            tripInfo={tripInfo}
          />

          <div className="pt-12 border-t border-border">
            <h3 className="text-xl font-display uppercase tracking-wide mb-6">
              Browse More Options
            </h3>
            <ServicesCatalog
              activeTab={activeTab}
              setActiveTab={setActiveTab}
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
              hotelCount={filteredHotels.length}
              carCount={filteredCars.length}
              paginatedHotels={paginatedHotels}
              paginatedCars={paginatedCars}
              hotelPage={hotelPage}
              setHotelPage={setHotelPage}
              hotelTotalPages={hotelTotalPages}
              carPage={carPage}
              setCarPage={setCarPage}
              carTotalPages={carTotalPages}
              guides={initialGuides}
              hotelItem={hotelItem}
              carItem={carItem}
              guideItem={guideItem}
              days={days}
              handleSelectHotel={handleSelectHotel}
              handleSelectCar={handleSelectCar}
              handleCarDriverChange={handleCarDriverChange}
              handleToggleGuide={handleToggleGuide}
            />
          </div>

          <div className="pt-12 border-t border-border">
            <h3 className="text-xl font-display uppercase tracking-wide mb-6">
              Finalize Your Details
            </h3>
            <ContactInfoStep
              form={form.form}
              tripInfo={tripInfo}
              updateTripInfo={planTrip.updateTripInfo}
            />
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="sticky top-24 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
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
            <form.form.Subscribe
              selector={(state: any) => [state.isSubmitting, state.canSubmit]}
            >
              {(state: any) => {
                const [isSubmitting, canFormSubmit] = state.value;
                return (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || !canFormSubmit || isSubmitting}
                    size="lg"
                    className="w-full rounded-sm font-display font-medium uppercase tracking-wider text-xs gap-2 h-12"
                  >
                    {isSubmitting ? (
                      <RiLoader4Line className="size-4 animate-spin" />
                    ) : (
                      <RiCheckDoubleLine className="size-4" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                );
              }}
            </form.form.Subscribe>
          </div>
        </div>
      </div>

      <ConflictDialog
        open={!!conflictItem}
        onOpenChange={(open) => !open && setConflictItem(null)}
        onConfirm={handleConfirmConflict}
        title={`Change ${conflictItem?.newItem.type === "hotel" ? "Hotel" : "Vehicle"}?`}
        description={`You already have a ${conflictItem?.newItem.type === "hotel" ? "hotel" : "vehicle"} in your trip. Would you like to replace "${conflictItem?.existingItem.title}" with "${conflictItem?.newItem.title}"?`}
      />

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Estimated total</p>
            <p className="text-xl font-display font-bold">
              ${total.toFixed(0)}*
            </p>
          </div>
          <form.form.Subscribe
            selector={(state: any) => [state.isSubmitting, state.canSubmit]}
          >
            {(state: any) => {
              const [isSubmitting, canFormSubmit] = state.value;
              return (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || !canFormSubmit || isSubmitting}
                  size="lg"
                  className="rounded-sm font-display font-medium uppercase tracking-wider text-xs h-11"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              );
            }}
          </form.form.Subscribe>
        </div>
      </div>
    </div>
  );
}
