"use client";

import { RiCheckDoubleLine } from "@remixicon/react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BookingSummary } from "@/components/plan-trip";
import { ContactInfoStep } from "@/components/plan-trip/steps/contact-info-step";
import { ServicesStep } from "@/components/plan-trip/steps/services-step";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { RevealText } from "@/components/ui/reveal-text";
import { AiLoading } from "@/components/plan-trip/ai-loading";
import { TripDetailsInput } from "@/components/plan-trip/trip-details-input";
import { usePlanTrip } from "@/hooks/use-plan-trip";
import { useTripForm } from "@/hooks/use-trip-form";
import { DRIVER_SURCHARGE } from "@/lib/configs";
import type { Car, Guide, Hotel } from "@/lib/plan_trip-types";
import { cn } from "@/lib/utils";
import { useTripStore } from "@/store/trip-store";

interface PlanTripClientProps {
  hotels: Hotel[];
  cars: Car[];
  guides: Guide[];
}

interface AiRecommendations {
  destination: string;
  itinerarySummary: string;
  totalEstimatedBudget: number;
  hotels: Hotel[];
  cars: Car[];
  guides: Guide[];
}

function mergeById<T extends { id: string }>(
  primary: T[],
  secondary: T[],
): T[] {
  const merged = new Map<string, T>();
  primary.forEach((item) => {
    merged.set(item.id, item);
  });
  secondary.forEach((item) => {
    if (!merged.has(item.id)) {
      merged.set(item.id, item);
    }
  });
  return Array.from(merged.values());
}

export default function PlanTripClient({
  hotels,
  cars,
  guides,
}: PlanTripClientProps) {
  const [aiRecommendations, setAiRecommendations] =
    useState<AiRecommendations | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Still merge for the underlying data/store logic if needed,
  // though we are relying heavily on AI results now.
  const mergedHotels = useMemo(
    () => mergeById(hotels, aiRecommendations?.hotels ?? []),
    [hotels, aiRecommendations],
  );
  const mergedCars = useMemo(
    () => mergeById(cars, aiRecommendations?.cars ?? []),
    [cars, aiRecommendations],
  );
  const mergedGuides = useMemo(
    () => mergeById(guides, aiRecommendations?.guides ?? []),
    [guides, aiRecommendations],
  );

  const {
    tripInfo,
    setTripInfo,
    items,
    addItem,
    removeItem,
    updateItem,
    activeTab,
    setActiveTab,
    days,
    travelers,
    subtotal,
    serviceFee,
    total,
    // Filters and pagination props are still passed to services step if we re-use it for results
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
    paginatedHotels,
    paginatedCars,
    hotelPage,
    setHotelPage,
    carPage,
    setCarPage,
    hotelTotalPages,
    carTotalPages,
    filteredHotels,
    filteredCars,
    initialGuides,
  } = usePlanTrip({
    initialHotels: mergedHotels,
    initialCars: mergedCars,
    initialGuides: mergedGuides,
  });

  const form = useTripForm();

  // If we have AI recommendations, we are in "Results" mode.
  // If isGeneratingAi is true, we are in "Loading" mode.
  // Otherwise, if tripInfo.destination is missing, we are in "Input" mode.
  // Actually, let's make it simpler:
  // If (!aiRecommendations && !isGeneratingAi) -> Input Mode (even if some data exists, allow editing)
  // But we might want to allow re-generating.

  // Let's use a derived state for the view.
  const viewState = useMemo(() => {
    if (isGeneratingAi) return "loading";
    if (aiRecommendations) return "results";
    return "input";
  }, [isGeneratingAi, aiRecommendations]);

  const handleGenerateAiRecommendations = async () => {
    const destination = tripInfo.destination?.trim();
    const startDate = tripInfo.departureDate;
    const endDate = tripInfo.returnDate;

    if (!destination || !startDate || !endDate) {
      const message = "Please provide destination and dates.";
      setAiError(message);
      toast.error(message);
      return;
    }

    setAiError(null);
    setIsGeneratingAi(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          groupSize: Math.max(
            1,
            tripInfo.adults + tripInfo.children + tripInfo.infants,
          ),
          tripPurpose: tripInfo.tripPurpose,
          specialRequests: tripInfo.specialRequests || undefined,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to generate AI recommendations.",
        );
      }

      setAiRecommendations({
        destination: data.destination,
        itinerarySummary: data.itinerarySummary,
        totalEstimatedBudget: data.totalEstimatedBudget,
        hotels: Array.isArray(data.hotels) ? data.hotels : [],
        cars: Array.isArray(data.cars) ? data.cars : [],
        guides: Array.isArray(data.guides) ? data.guides : [],
      });
      toast.success("Itinerary generated successfully!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate AI recommendations.";
      setAiError(message);
      toast.error(message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleClearAiRecommendations = () => {
    setAiRecommendations(null);
    setAiError(null);
  };

  const canSubmit = !!(tripInfo.name && tripInfo.email);

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please fill in your name and email before submitting.");
      return;
    }
    await form.handleSubmit();
  };

  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-background pt-24 pb-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-12 text-center">
            <RevealText
              text="Plan Your Journey"
              className="font-display text-4xl md:text-6xl font-medium uppercase text-foreground mb-4 justify-center"
              delay={0.1}
            />
          </div>

          {/* Conditional View Rendering */}
          <div className="min-h-[400px]">
            {viewState === "loading" && <AiLoading />}

            {viewState === "input" && (
              <TripDetailsInput
                tripInfo={tripInfo}
                setTripInfo={setTripInfo}
                onGenerate={handleGenerateAiRecommendations}
                isGenerating={isGeneratingAi}
              />
            )}

            {viewState === "results" && aiRecommendations && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-card border border-border p-6 rounded-xl">
                  <div>
                    <h3 className="text-xl font-display uppercase tracking-wide">
                      Your Itinerary for {aiRecommendations.destination}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-3xl">
                      {aiRecommendations.itinerarySummary}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleClearAiRecommendations}
                  >
                    Start Over
                  </Button>
                </div>

                <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
                  <div className="space-y-8">
                    {/* Re-using ServicesStep but purely for displaying results now */}
                    {/* We pass the AI recommendations which will trigger the AI view in ServicesStep */}
                    <ServicesStep
                      items={items}
                      addItem={addItem}
                      removeItem={removeItem}
                      updateItem={updateItem}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      showMobileSummary={false}
                      setShowMobileSummary={() => {}}
                      tripInfo={tripInfo}
                      days={days}
                      total={total}
                      travelers={travelers}
                      subtotal={subtotal}
                      serviceFee={serviceFee}
                      paginatedHotels={paginatedHotels}
                      paginatedCars={paginatedCars}
                      hotelTotalPages={hotelTotalPages}
                      carTotalPages={carTotalPages}
                      hotelCount={filteredHotels.length}
                      carCount={filteredCars.length}
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
                      hotelPage={hotelPage}
                      setHotelPage={setHotelPage}
                      carPage={carPage}
                      setCarPage={setCarPage}
                      guides={initialGuides}
                      aiRecommendations={aiRecommendations}
                      onClearAi={handleClearAiRecommendations}
                    />

                    {/* We can also add the ContactInfo step here if users want to finalize */}
                    <div className="mt-12 pt-12 border-t border-border">
                      <h3 className="text-xl font-display uppercase tracking-wide mb-6">
                        Finalize Your Details
                      </h3>
                      <ContactInfoStep
                        form={form}
                        tripInfo={tripInfo}
                        setTripInfo={setTripInfo}
                      />
                    </div>
                  </div>

                  {/* Sidebar */}
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
                      <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        size="lg"
                        className="w-full rounded-sm font-display font-medium uppercase tracking-wider text-sm gap-2 h-14"
                      >
                        <RiCheckDoubleLine className="size-5" />
                        Submit Request
                      </Button>
                      {!canSubmit && (
                        <p className="text-xs text-muted-foreground text-center">
                          Complete your details below to submit
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* mobile submit for results view */}
          {viewState === "results" && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-30">
              <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Estimated total
                  </p>
                  <p className="text-xl font-display font-bold">
                    ${total.toFixed(0)}*
                  </p>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  size="lg"
                  className="rounded-sm font-display font-medium uppercase tracking-wider text-sm gap-2"
                >
                  <RiCheckDoubleLine className="size-5" />
                  Submit
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
