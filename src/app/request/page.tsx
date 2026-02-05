"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RiMapPinLine,
  RiCalendarLine,
  RiUserSmileLine,
  RiPlaneLine,
  RiHotelLine,
  RiCarLine,
  RiCompass3Line,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
} from "@remixicon/react";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const experienceId = searchParams.get("experience");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Interest
    interest: experienceId ? "experience" : "",
    selectedExperience: experienceId || "",

    // Step 2: Logistics
    arrivalDate: "",
    departureDate: "",
    travelers: 2,

    // Step 3: Services
    needsFlights: false,
    needsHotel: false,
    needsCar: false,
    needsGuide: false,

    // Step 4: Contact
    name: "",
    email: "",
    notes: "",
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log("Submitting:", formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/request/req-123/services");
  };

  // Mock experiences list for selection
  const interests = [
    { id: "adventure", label: "Adventure & Wildlife", icon: RiCompass3Line },
    { id: "relaxation", label: "Relaxation & Beach", icon: RiHotelLine },
    { id: "culture", label: "Culture & History", icon: RiMapPinLine },
    { id: "business", label: "Business Trip", icon: RiPlaneLine },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-muted/30 pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-5">
          {/* Stepper Wizard */}
          <div className="mb-10">
            <Stepper value={step} onValueChange={setStep}>
              {[
                { step: 1, title: "Interest", description: "Travel Style" },
                { step: 2, title: "Logistics", description: "Dates & Pax" },
                { step: 3, title: "Services", description: "Requirements" },
                { step: 4, title: "Contact", description: "Your Details" },
              ].map(({ step: s, title, description }, index, array) => (
                <StepperItem
                  key={s}
                  step={s}
                  className="not-last:flex-1"
                  completed={step > s}
                >
                  <StepperTrigger className="flex flex-col items-center text-center gap-2">
                    <StepperIndicator />
                    <div className="hidden sm:block">
                      <StepperTitle>{title}</StepperTitle>
                      <StepperDescription>{description}</StepperDescription>
                    </div>
                  </StepperTrigger>
                  {index < array.length - 1 && (
                    <StepperSeparator className="mx-4" />
                  )}
                </StepperItem>
              ))}
            </Stepper>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-border bg-white">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                {step === 1 && "What brings you to Rwanda?"}
                {step === 2 && "When are you planning to travel?"}
                {step === 3 && "What services do you need?"}
                {step === 4 && "Where should we send your quote?"}
              </h1>
              <p className="text-muted-foreground">
                {step === 1 &&
                  "Select the primary travel style that matches your goals."}
                {step === 2 &&
                  "Rough dates are fine. We can help you refine them later."}
                {step === 3 &&
                  "We'll handle the bookings for everything you select."}
                {step === 4 &&
                  "Our team will review your request and get back to you within 24 hours."}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* STEP 1: Interest */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {interests.map((interest) => {
                      const Icon = interest.icon;
                      const isSelected = formData.interest === interest.id;
                      return (
                        <div
                          key={interest.id}
                          onClick={() =>
                            setFormData({ ...formData, interest: interest.id })
                          }
                          className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center transition-all hover:border-primary/50 relative ${isSelected ? "border-primary bg-primary/5" : "border-transparent bg-muted/50"}`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 text-primary">
                              <RiCheckLine className="size-6 bg-white rounded-full p-1" />
                            </div>
                          )}
                          <div
                            className={`size-16 rounded-full flex items-center justify-center ${isSelected ? "bg-primary text-white" : "bg-white text-muted-foreground"}`}
                          >
                            <Icon className="size-8" />
                          </div>
                          <span
                            className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}
                          >
                            {interest.label}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* STEP 2: Logistics */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Arrival Date (Est.)
                        </label>
                        <div className="relative">
                          <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-10 h-12"
                            value={formData.arrivalDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                arrivalDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Departure Date (Est.)
                        </label>
                        <div className="relative">
                          <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-10 h-12"
                            value={formData.departureDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                departureDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Number of Travelers
                      </label>
                      <div className="relative">
                        <RiUserSmileLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                          type="number"
                          min={1}
                          className="pl-10 h-12"
                          value={formData.travelers}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              travelers: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Services */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {[
                      {
                        id: "needsFlights",
                        icon: RiPlaneLine,
                        label: "Flights",
                        desc: "International & Domestic",
                      },
                      {
                        id: "needsHotel",
                        icon: RiHotelLine,
                        label: "Accommodation",
                        desc: "Hotels, Lodges & Resorts",
                      },
                      {
                        id: "needsCar",
                        icon: RiCarLine,
                        label: "Transportation",
                        desc: "Car Rental & Transfers",
                      },
                      {
                        id: "needsGuide",
                        icon: RiCompass3Line,
                        label: "Local Guide",
                        desc: "Expert Guides & Translators",
                      },
                    ].map((item) => {
                      const Key = item.id as keyof typeof formData;
                      const isSelected = !!formData[Key];
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() =>
                            setFormData({ ...formData, [Key]: !isSelected })
                          }
                          className={`cursor-pointer border-2 rounded-xl p-5 flex items-center gap-4 transition-all ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                        >
                          <div
                            className={`size-12 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                          >
                            <Icon className="size-6" />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}
                            >
                              {item.label}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {item.desc}
                            </p>
                          </div>
                          <div
                            className={`size-6 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/30"}`}
                          >
                            {isSelected && <RiCheckLine className="size-4" />}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* STEP 4: Contact */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        placeholder="John Doe"
                        className="h-12"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="h-12"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Additional Notes / Budget Preferences
                      </label>
                      <Textarea
                        placeholder="Tell us more about your ideal trip..."
                        className="min-h-[120px]"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-border bg-muted/10 flex justify-between items-center">
              {step > 1 ? (
                <Button variant="ghost" onClick={prevStep} className="gap-2">
                  <RiArrowLeftLine className="size-5" /> Back
                </Button>
              ) : (
                <div /> /* Spacer */
              )}

              {step < 4 ? (
                <Button onClick={nextStep} size="lg" className="gap-2 px-8">
                  Next Step <RiArrowRightLine className="size-5" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} size="lg" className="gap-2 px-8">
                  Submit Request <RiArrowRightLine className="size-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
