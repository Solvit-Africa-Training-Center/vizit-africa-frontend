"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  RiFlightTakeoffLine,
  RiFlightLandLine,
  RiCalendarLine,
  RiUserLine,
  RiSearchLine,
  RiPlaneLine,
  RiArrowRightLine,
  RiCheckLine,
  RiAddLine,
  RiSubtractLine,
} from "@remixicon/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { flights } from "@/lib/dummy-data";
import type { Flight, Selections, TripInfo } from "@/lib/plan_trip-types";
import { cn } from "@/lib/utils";
import type { TripForm, TripFormValues } from "@/hooks/use-trip-form";

const ALL_FLIGHTS = [...flights];

interface FlightStepProps {
  form: TripForm;
  tripInfo: TripInfo;
  setTripInfo: (info: Partial<TripInfo>) => void;
  selections: Selections;
  setSelections: (selections: Partial<Selections>) => void;
  onNext: () => void;
}

export function FlightStep({
  form,
  tripInfo,
  setTripInfo,
  selections,
  setSelections,
  onNext,
}: FlightStepProps) {
  const [includeFlight, setIncludeFlight] = useState(!!selections.flight || true);
  const [isRoundTrip, setIsRoundTrip] = useState(!!tripInfo.returnDate || true);

  const handleToggleFlight = (checked: boolean) => {
    setIncludeFlight(checked);
    if (!checked) {
      setSelections({ flight: null });
    } else {
      setSelections({
        flight: {
          id: "requested",
          airline: "Best Option",
          flightNumber: "TBD",
          departureCity: tripInfo.departureCity,
          arrivalCity: tripInfo.destination,
          departureAirport: "TBD",
          arrivalAirport: "TBD",
          departureTime: tripInfo.departureDate,
          arrivalTime: "",
          duration: "",
          price: 0,
          cabinClass: "Economy",
          stops: 0,
        },
      });
    }
  };

  const handleToggleTripType = (round: boolean) => {
    setIsRoundTrip(round);
    if (!round) {
      setTripInfo({ returnDate: "" });
      form.setFieldValue("returnDate", "");
    }
  };

  // helper to sync both form + store on field change
  const updateField = (field: keyof TripFormValues, value: string | number) => {
    form.setFieldValue(field, value as never);
    setTripInfo({ [field]: value });
  };

  const totalTravelers =
    tripInfo.adults + tripInfo.children + (tripInfo.infants || 0);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-medium uppercase tracking-tight">
          Flight Preferences
        </h2>
        <p className="text-muted-foreground font-light">
          Tell us your travel details and our experts will find the most
          cost-effective flight options (including return tickets) within 48
          hours.
        </p>
      </div>

      <div className="bg-muted/30 p-6 rounded-xl border border-border space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="space-y-0.5">
            <Label className="text-base">Include flights in my quote</Label>
            <p className="text-sm text-muted-foreground font-light">
              We'll source the best one-way or return prices for you.
            </p>
          </div>
          <div
            className={cn(
              "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200",
              includeFlight ? "bg-primary" : "bg-muted-foreground/30",
            )}
            onClick={() => handleToggleFlight(!includeFlight)}
          >
            <div
              className={cn(
                "w-4 h-4 bg-white rounded-full transition-transform duration-200",
                includeFlight ? "translate-x-6" : "translate-x-0",
              )}
            />
          </div>
        </div>

        {includeFlight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-6"
          >
            <div className="flex gap-4 p-1 bg-background border border-border rounded-sm w-fit">
              <button
                type="button"
                onClick={() => handleToggleTripType(true)}
                className={cn(
                  "px-4 py-1.5 text-xs font-display font-medium uppercase tracking-wider transition-colors",
                  isRoundTrip ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                Round Trip
              </button>
              <button
                type="button"
                onClick={() => handleToggleTripType(false)}
                className={cn(
                  "px-4 py-1.5 text-xs font-display font-medium uppercase tracking-wider transition-colors",
                  !isRoundTrip ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                One Way
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field
                name="departureCity"
                validators={{
                  onBlur: ({ value }) =>
                    !value ? "departure city is required" : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label>From</Label>
                    <div className="relative">
                      <RiFlightTakeoffLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="City or Airport"
                        className="pl-9 bg-background"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setTripInfo({ departureCity: e.target.value });
                        }}
                        onBlur={field.handleBlur}
                      />
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Field name="destination">
                {(field) => (
                  <div className="space-y-2">
                    <Label>To</Label>
                    <div className="relative">
                      <RiFlightLandLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Destination (e.g. Kigali)"
                        className="pl-9 bg-background"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setTripInfo({ destination: e.target.value });
                        }}
                      />
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Field
                name="departureDate"
                validators={{
                  onBlur: ({ value }) =>
                    !value ? "departure date is required" : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label>Departure Date</Label>
                    <div className="relative">
                      <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-9 bg-background"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setTripInfo({ departureDate: e.target.value });
                        }}
                        onBlur={field.handleBlur}
                      />
                    </div>
                  </div>
                )}
              </form.Field>

              {isRoundTrip && (
                <form.Field name="returnDate">
                  {(field) => (
                    <div className="space-y-2">
                      <Label>Return Date</Label>
                      <div className="relative">
                        <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-9 bg-background"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setTripInfo({ returnDate: e.target.value });
                          }}
                          min={tripInfo.departureDate}
                        />
                      </div>
                    </div>
                  )}
                </form.Field>
              )}

            <div className="space-y-2 md:col-span-2">
              <Label>Travelers</Label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      "w-full justify-start text-left font-normal pl-9 relative flex items-center h-10 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer",
                    )}
                  >
                    <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <span>
                      {totalTravelers} Traveler{totalTravelers > 1 ? "s" : ""}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Adults</div>
                          <div className="text-xs text-muted-foreground">
                            Ages 12+
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateField(
                                "adults",
                                Math.max(1, tripInfo.adults - 1),
                              )
                            }
                            disabled={tripInfo.adults <= 1}
                          >
                            <RiSubtractLine className="h-4 w-4" />
                          </Button>
                          <span className="text-sm w-4 text-center">
                            {tripInfo.adults}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateField(
                                "adults",
                                Math.min(9, tripInfo.adults + 1),
                              )
                            }
                            disabled={tripInfo.adults >= 9}
                          >
                            <RiAddLine className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Children</div>
                          <div className="text-xs text-muted-foreground">
                            Ages 2-11
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateField(
                                "children",
                                Math.max(0, tripInfo.children - 1),
                              )
                            }
                            disabled={tripInfo.children <= 0}
                          >
                            <RiSubtractLine className="h-4 w-4" />
                          </Button>
                          <span className="text-sm w-4 text-center">
                            {tripInfo.children}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateField(
                                "children",
                                Math.min(9, tripInfo.children + 1),
                              )
                            }
                            disabled={tripInfo.children >= 9}
                          >
                            <RiAddLine className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Infants</div>
                          <div className="text-xs text-muted-foreground">
                            Ages 0-2
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateField(
                                "infants",
                                Math.max(0, (tripInfo.infants || 0) - 1),
                              )
                            }
                            disabled={(tripInfo.infants || 0) <= 0}
                          >
                            <RiSubtractLine className="h-4 w-4" />
                          </Button>
                          <span className="text-sm w-4 text-center">
                            {tripInfo.infants || 0}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateField(
                                "infants",
                                Math.min(
                                  tripInfo.adults,
                                  (tripInfo.infants || 0) + 1,
                                ),
                              )
                            }
                            disabled={(tripInfo.infants || 0) >= tripInfo.adults}
                          >
                            <RiAddLine className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Additional Flight Notes</Label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Prefer direct flights, specific airlines, or cabin class preferences..."
                value={tripInfo.specialRequests}
                onChange={(e) => setTripInfo({ specialRequests: e.target.value })}
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-end items-center pt-8 border-t border-border">
        <Button
          onClick={onNext}
          disabled={includeFlight && (!tripInfo.departureCity || !tripInfo.departureDate)}
        >
          Continue to Stay & Services <RiArrowRightLine className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
