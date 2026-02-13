"use client";

import { BookingSummary } from "@/components/plan-trip";
import { ContactInfoStep } from "@/components/plan-trip/steps/contact-info-step";
import { FlightStep } from "@/components/plan-trip/steps/flight-step";
import { ServicesStep } from "@/components/plan-trip/steps/services-step";
import { Navbar } from "@/components/shared/navbar";
import { RevealText } from "@/components/ui/reveal-text";
import { usePlanTrip } from "@/hooks/use-plan-trip";
import { useTripForm } from "@/hooks/use-trip-form";
import { DRIVER_SURCHARGE } from "@/lib/plan-trip-data";
import { TripSection } from "@/components/plan-trip/trip-section";
import { ContextBanner } from "@/components/plan-trip/context-banner";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTripStore } from "@/store/trip-store";
import {
  RiFlightTakeoffLine,
  RiHotelLine,
  RiUserLine,
  RiCheckDoubleLine,
} from "@remixicon/react";

export default function PlanTripPage() {
  const tHeader = useTranslations("PlanTrip.header");

  const {
    tripInfo,
    setTripInfo,
    selections,
    setSelections,
    activeTab,
    setActiveTab,
    days,
    travelers,
    subtotal,
    serviceFee,
    total,
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
  } = usePlanTrip();

  const form = useTripForm();
  const entrySource = useTripStore((s) => s.entrySource);

  const flightSummary = selections.flight
    ? selections.flight.id === "requested"
      ? `${tripInfo.departureCity || "One Way"} to ${tripInfo.destination || "Kigali"} · ${tripInfo.returnDate ? "Round Trip" : "One Way"}`
      : `${selections.flight.airline} ${selections.flight.flightNumber} · $${selections.flight.price}`
    : undefined;

  const servicesSummary = (() => {
    const parts: string[] = [];
    if (selections.hotel) parts.push(selections.hotel.name);
    if (selections.car) parts.push(selections.car.model);
    if (selections.guide) parts.push("Guide");
    if (tripInfo.specialRequests) {
      const notes = tripInfo.specialRequests.split("\n").filter(Boolean);
      parts.push(`${notes.length} Special Request${notes.length > 1 ? "s" : ""}`);
    }
    return parts.length > 0 ? parts.join(" · ") : undefined;
  })();

  const detailsSummary =
    tripInfo.name && tripInfo.email
      ? `${tripInfo.name} · ${tripInfo.email}`
      : undefined;

  const isReadyToSubmit = !!(tripInfo.name && tripInfo.email && tripInfo.departureCity && tripInfo.departureDate);
  const canSubmit = !!(tripInfo.name && tripInfo.email);

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("Please fill in your name and email before submitting.");
      return;
    }
    form.handleSubmit();
    toast.success("Trip request submitted successfully!");
  };

  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-background pt-24 pb-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-12">
            <RevealText
              text={tHeader("title")}
              className="font-display text-4xl md:text-6xl font-medium uppercase text-foreground mb-4"
              delay={0.1}
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl"
            >
              {tHeader("description")}
            </motion.p>
          </div>

          <ContextBanner destination={tripInfo.destination} />

          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="space-y-3">
              {/* flight section */}
              <TripSection
                icon={<RiFlightTakeoffLine className="size-5" />}
                title="Flight"
                status={selections.flight ? "selected" : "empty"}
                summary={flightSummary}
                defaultExpanded={
                  entrySource === "widget" ||
                  entrySource === "flights" ||
                  entrySource === "direct"
                }
              >
                <FlightStep
                  form={form}
                  tripInfo={tripInfo}
                  setTripInfo={setTripInfo}
                  selections={selections}
                  setSelections={setSelections}
                  onNext={() => {}}
                />
              </TripSection>

              {/* services section (hotels, cars, guides) */}
              <TripSection
                icon={<RiHotelLine className="size-5" />}
                title="Stay & Services"
                status={
                  selections.hotel ||
                  selections.car ||
                  selections.guide ||
                  tripInfo.specialRequests
                    ? "selected"
                    : "empty"
                }
                summary={servicesSummary}
                defaultExpanded={entrySource === "services"}
              >
                <ServicesStep
                  selections={selections}
                  setSelections={
                    setSelections as (s: typeof selections) => void
                  }
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
                />
              </TripSection>

              {/* traveler details section */}
              <TripSection
                icon={<RiUserLine className="size-5" />}
                title="Your Details"
                status={detailsSummary ? "selected" : "empty"}
                summary={detailsSummary}
                defaultExpanded={
                  entrySource !== "widget" &&
                  entrySource !== "direct" &&
                  !!(selections.flight || selections.hotel) &&
                  !detailsSummary
                }
              >
                <ContactInfoStep
                  form={form}
                  tripInfo={tripInfo}
                  setTripInfo={setTripInfo}
                />
              </TripSection>
            </div>

            {/* sticky sidebar */}
            <div className="hidden lg:block relative">
              <div className="sticky top-24 space-y-4">
                {isReadyToSubmit && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-primary/10 border border-primary/20 rounded-sm text-center space-y-2"
                  >
                    <p className="text-xs font-medium text-primary uppercase tracking-widest">
                      Ready to Go
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      We have all your details. You can submit your request
                      immediately.
                    </p>
                  </motion.div>
                )}
                <BookingSummary
                  currentStep={1}
                  tripInfo={tripInfo}
                  selections={selections}
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
                  className={cn(
                    "w-full rounded-sm font-display font-medium uppercase tracking-wider text-sm gap-2 transition-all duration-500",
                    isReadyToSubmit ? "bg-primary h-16 text-base" : "",
                  )}
                >
                  <RiCheckDoubleLine className="size-5" />
                  {isReadyToSubmit
                    ? "Submit Quote Request Now"
                    : "Get My Quote"}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center leading-tight">
                  No payment required now. You'll receive a detailed itinerary
                  and final pricing within 48 hours.
                </p>
                {!canSubmit && (
                  <p className="text-xs text-muted-foreground text-center">
                    Fill in your name & email to proceed
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* mobile submit */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-30">
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
              <div>
                <p className="text-xs text-muted-foreground">Estimated total</p>
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
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
