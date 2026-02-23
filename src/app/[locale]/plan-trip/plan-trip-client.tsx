"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AiLoading, PlanTripResults } from "@/components/plan-trip";
import { TripDetailsInput } from "@/components/plan-trip/trip-details-input";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";
import { usePlanTrip } from "@/hooks/use-plan-trip";
import { useTripForm } from "@/hooks/use-trip-form";
import type { Car, Guide, Hotel } from "@/lib/plan_trip-types";
import { cn } from "@/lib/utils";

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

function mergeById<T extends { id: string | number }>(
  primary: T[],
  secondary: T[],
): T[] {
  const merged = new Map<string | number, T>();
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
  const t = useTranslations("PlanTrip");
  // UI skill: AI recommendations state
  const [aiRecommendations, setAiRecommendations] =
    useState<AiRecommendations | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // UI skill: useObject for AI
  const aiObject = useObject({
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
  const {
    object: partialRecommendations,
    submit,
    isLoading: isGeneratingAi,
  } = aiObject;

  // UI skill: merge recommendations
  const activeRecommendations = (aiRecommendations ||
    partialRecommendations) as AiRecommendations | null;
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

  // UI skill: planTrip store
  const planTrip = usePlanTrip({
    initialHotels: mergedHotels,
    initialCars: mergedCars,
    initialGuides: mergedGuides,
  });
  const form = useTripForm();

  // UI skill: view state
  const viewState = useMemo(() => {
    if (isGeneratingAi) return "loading";
    if (aiRecommendations) return "results";
    return "input";
  }, [isGeneratingAi, aiRecommendations]);

  // UI skill: handleGenerateAiRecommendations
  const handleGenerateAiRecommendations = () => {
    const {
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      tripPurpose,
      specialRequests,
    } = planTrip.tripInfo;
    if (!destination?.trim() || !departureDate || !returnDate) {
      const message = "Please provide destination and dates.";
      setAiError(message);
      toast.error(message);
      return;
    }
    setAiError(null);
    setAiRecommendations(null);
    submit({
      destination: destination.trim(),
      startDate: departureDate,
      endDate: returnDate,
      groupSize: Math.max(1, (adults || 0) + (children || 0) + (infants || 0)),
      tripPurpose,
      specialRequests: specialRequests || undefined,
    });
  };

  // UI skill: handleClearAiRecommendations
  const handleClearAiRecommendations = () => {
    setAiRecommendations(null);
    setAiError(null);
  };

  // UI skill: handleSubmit
  const handleSubmit = async () => {
    const { name, email } = planTrip.tripInfo;
    if (!name || !email) {
      toast.error("Please fill in your name and email before submitting.");
      return;
    }
    await form.form.handleSubmit();
  };

  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <PageHeader
          title={t("header.title")}
          overline={t("tripDetails.title")}
          description={t("header.description")}
          layout="split"
          className="mb-24 md:mb-32"
        />

        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="px-5 md:px-10 max-w-7xl mx-auto py-6 flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div className="w-full md:w-auto">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                AI Trip Builder
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {planTrip.tripInfo.destination
                  ? `Destination: ${planTrip.tripInfo.destination}`
                  : t("tripDetails.subheading")}
              </p>
              {aiError ? (
                <p className="mt-2 text-xs text-destructive">{aiError}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {[
                { key: "input", label: t("tripDetails.title") },
                { key: "loading", label: t("loading.title") },
                { key: "results", label: "Itinerary" },
              ].map((step) => (
                <div
                  key={step.key}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] border whitespace-nowrap",
                    viewState === step.key
                      ? "bg-foreground text-background border-foreground"
                      : "border-border/50 text-muted-foreground",
                  )}
                >
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="px-5 md:px-10 max-w-7xl mx-auto py-12 min-h-[50vh]">
          {viewState === "loading" && <AiLoading />}

          {viewState === "input" && (
            <TripDetailsInput
              tripInfo={planTrip.tripInfo}
              updateTripInfo={planTrip.updateTripInfo}
              onGenerate={handleGenerateAiRecommendations}
              isGenerating={isGeneratingAi}
            />
          )}

          {viewState === "results" && activeRecommendations && (
            <PlanTripResults
              activeRecommendations={activeRecommendations}
              onClearAi={handleClearAiRecommendations}
              planTrip={planTrip}
              form={form}
              handleSubmit={handleSubmit}
              isGenerating={isGeneratingAi}
            />
          )}
        </section>
      </main>
    </>
  );
}
