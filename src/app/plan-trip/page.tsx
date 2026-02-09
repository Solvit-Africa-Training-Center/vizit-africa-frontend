"use client";

import { motion, AnimatePresence } from "motion/react";
import { RiCheckLine } from "@remixicon/react";

import { Navbar } from "@/components/shared/navbar";
import { usePlanTrip } from "@/hooks/use-plan-trip";
import { BookingSummary } from "@/components/plan-trip";
import { RevealText } from "@/components/ui/reveal-text";
import { TripDetailsStep } from "@/components/plan-trip/steps/trip-details-step";
import { ContactInfoStep } from "@/components/plan-trip/steps/contact-info-step";
import { ServicesStep } from "@/components/plan-trip/steps/services-step";
import { ReviewStep } from "@/components/plan-trip/steps/review-step";
import { DRIVER_SURCHARGE } from "@/lib/plan-trip-data";
import { useState } from "react";

const STEPS = [
  { num: 1, label: "Trip Details" },
  { num: 2, label: "Contact" },
  { num: 3, label: "Services" },
  { num: 4, label: "Review" },
];

export default function PlanTripPage() {
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
    canProceedToContact,
    canProceedToServices,
    canProceedToReview,
  } = usePlanTrip();

  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const handleSubmit = () => {
    setCurrentStep(4);
    alert("Booking submitted! We'll contact you within 24 hours.");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cinematic Header */}
          <div className="mb-12 md:mb-16">
            <RevealText
              text="Plan Your Trip"
              className="font-display text-4xl md:text-6xl font-black uppercase text-foreground mb-4"
              delay={0.1}
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl"
            >
              Customize your perfect African adventure. We'll handle the details
              while you focus on the journey.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            {/* Left Column: Steps */}
            <div className="space-y-8">
              {/* Minimal Stepper */}
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
                {STEPS.map((step, i) => (
                  <div key={step.num} className="flex items-center shrink-0">
                    <button
                      type="button"
                      // 1. Allow clicking any step in the header
                      onClick={() => setCurrentStep(step.num)}
                      className={`flex items-center gap-3 transition-colors group cursor-pointer ${
                        currentStep === step.num
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      <span
                        className={`size-8 flex items-center justify-center text-sm font-bold border transition-all ${
                          currentStep === step.num
                            ? "border-primary bg-primary text-white"
                            : currentStep > step.num
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-transparent"
                        }`}
                      >
                        {currentStep > step.num ? (
                          <RiCheckLine className="size-4" />
                        ) : (
                          step.num.toString().padStart(2, "0")
                        )}
                      </span>
                      <span className="font-display font-bold uppercase tracking-wider text-sm">
                        {step.label}
                      </span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className="w-8 md:w-12 h-px bg-border mx-4" />
                    )}
                  </div>
                ))}
              </div>

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

            {/* Right Column: Sticky Summary */}
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
