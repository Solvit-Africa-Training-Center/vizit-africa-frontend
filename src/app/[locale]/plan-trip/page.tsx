"use client";

import { BookingSummary, Stepper } from "@/components/plan-trip";
import { ContactInfoStep } from "@/components/plan-trip/steps/contact-info-step";
import { ReviewStep } from "@/components/plan-trip/steps/review-step";
import { ServicesStep } from "@/components/plan-trip/steps/services-step";
import { TripDetailsStep } from "@/components/plan-trip/steps/trip-details-step";
import { Navbar } from "@/components/shared/navbar";
import { RevealText } from "@/components/ui/reveal-text";
import { usePlanTrip } from "@/hooks/use-plan-trip";
import { DRIVER_SURCHARGE } from "@/lib/plan-trip-data";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function PlanTripPage() {
  const tHeader = useTranslations("PlanTrip.header");
  const tSteps = useTranslations("PlanTrip.steps");
  const tReview = useTranslations("PlanTrip.review");

  const STEPS = [
    { num: 1, label: tSteps("tripDetails") },
    { num: 2, label: tSteps("contact") },
    { num: 3, label: tSteps("services") },
    { num: 4, label: tSteps("review") },
  ];

  const {
    currentStep,
    setCurrentStep,
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

  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const handleSubmit = () => {
    setCurrentStep(4);
    toast.success(tReview("success"));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
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

          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            <div className="space-y-8">
              <Stepper
                currentStep={currentStep}
                steps={STEPS}
                onStepClick={setCurrentStep}
              />

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <TripDetailsStep
                    tripInfo={tripInfo}
                    setTripInfo={setTripInfo}
                    onNext={() => setCurrentStep(2)}
                    canProceed={true}
                  />
                )}

                {currentStep === 2 && (
                  <ContactInfoStep
                    tripInfo={tripInfo}
                    setTripInfo={setTripInfo}
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                    canProceed={true}
                  />
                )}

                {currentStep === 3 && (
                  <ServicesStep
                    selections={selections}
                    setSelections={setSelections}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    showMobileSummary={showMobileSummary}
                    setShowMobileSummary={setShowMobileSummary}
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
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                    canProceed={true}
                  />
                )}

                {currentStep === 4 && (
                  <ReviewStep
                    tripInfo={tripInfo}
                    selections={selections}
                    days={days}
                    travelers={travelers}
                    subtotal={subtotal}
                    serviceFee={serviceFee}
                    total={total}
                    onBack={() => setCurrentStep(3)}
                    onSubmit={handleSubmit}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:block relative">
              <div className="sticky top-24">
                <BookingSummary
                  currentStep={currentStep}
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
          </div>
        </div>
      </main>
    </>
  );
}
