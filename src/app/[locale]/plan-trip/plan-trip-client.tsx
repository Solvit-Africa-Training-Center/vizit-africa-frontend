"use client";

import { RiCheckDoubleLine, RiLoader4Line } from "@remixicon/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BookingSummary } from "@/components/plan-trip";
import { ContactInfoStep } from "@/components/plan-trip/contact-info";
import { ServicesStep } from "@/components/plan-trip/steps/services-step";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { RevealText } from "@/components/ui/reveal-text";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AiLoading } from "@/components/plan-trip/ai-loading";
import { TripDetailsInput } from "@/components/plan-trip/trip-details-input";
import { usePlanTrip } from "@/hooks/use-plan-trip";
import { useTripForm } from "@/hooks/use-trip-form";
import { DRIVER_SURCHARGE } from "@/lib/configs";
import type { Car, Guide, Hotel } from "@/lib/plan_trip-types";
import { z } from "zod";

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
  const [aiError, setAiError] = useState<string | null>(null);

  const {
    object: partialRecommendations,
    submit,
    isLoading: isGeneratingAi,
    error: streamingError,
  } = useObject({
    api: "/api/ai",
    schema: z.object({
      destination: z.string(),
      itinerarySummary: z.string(),
      totalEstimatedBudget: z.number(),
      hotels: z.array(z.any()),
      cars: z.array(z.any()),
      guides: z.array(z.any()),
    }),
    onFinish: ({ object }) => {
      if (object) {
        setAiRecommendations(object as AiRecommendations);
        toast.success("Itinerary generated successfully!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate AI recommendations.");
    },
  });

  // Use partialRecommendations while streaming, or final aiRecommendations
  const activeRecommendations = (aiRecommendations ||
    partialRecommendations) as AiRecommendations | null;

  // Still merge for the underlying data/store logic if needed,
  // though we are relying heavily on AI results now.
  const mergedHotels = useMemo(
    () => mergeById(hotels, activeRecommendations?.hotels ?? []),
    [hotels, activeRecommendations],
  );
  const mergedCars = useMemo(
    () => mergeById(cars, activeRecommendations?.cars ?? []),
    [cars, activeRecommendations],
  );
  const mergedGuides = useMemo(
    () => mergeById(guides, activeRecommendations?.guides ?? []),
    [guides, activeRecommendations],
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
    if (activeRecommendations) return "results";
    return "input";
  }, [isGeneratingAi, activeRecommendations]);

  const handleGenerateAiRecommendations = () => {
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
    setAiRecommendations(null); // Clear previous results

    submit({
      destination,
      startDate,
      endDate,
      groupSize: Math.max(
        1,
        tripInfo.adults + tripInfo.children + tripInfo.infants,
      ),
      tripPurpose: tripInfo.tripPurpose,
      specialRequests: tripInfo.specialRequests || undefined,
    });
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

            {viewState === "results" && activeRecommendations && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-card border border-border p-6 rounded-xl">
                  <div>
                    <h3 className="text-xl font-display uppercase tracking-wide">
                      Your Itinerary for {activeRecommendations?.destination}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-3xl">
                      {activeRecommendations?.itinerarySummary}
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
                      aiRecommendations={activeRecommendations as any}
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
                      <form.Subscribe
                        selector={(state) => [
                          state.isSubmitting,
                          state.canSubmit,
                        ]}
                      >
                        {([isSubmitting, canFormSubmit]) => (
                          <Button
                            onClick={handleSubmit}
                            disabled={
                              !canSubmit || !canFormSubmit || isSubmitting
                            }
                            size="lg"
                            className="w-full rounded-sm font-display font-medium uppercase tracking-wider text-sm gap-2 h-14"
                          >
                            {isSubmitting ? (
                              <RiLoader4Line className="size-5 animate-spin" />
                            ) : (
                              <RiCheckDoubleLine className="size-5" />
                            )}
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                          </Button>
                        )}
                      </form.Subscribe>
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
                <form.Subscribe
                  selector={(state) => [state.isSubmitting, state.canSubmit]}
                >
                  {([isSubmitting, canFormSubmit]) => (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canSubmit || !canFormSubmit || isSubmitting}
                      size="lg"
                      className="rounded-sm font-display font-medium uppercase tracking-wider text-sm gap-2"
                    >
                      {isSubmitting ? (
                        <RiLoader4Line className="size-5 animate-spin" />
                      ) : (
                        <RiCheckDoubleLine className="size-5" />
                      )}
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
