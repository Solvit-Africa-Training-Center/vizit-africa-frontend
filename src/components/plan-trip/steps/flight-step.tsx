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
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filteredFlights = useMemo(() => {
    if (!hasSearched) return [];

    return ALL_FLIGHTS.filter((flight) => {
      const matchFrom =
        !tripInfo.departureCity ||
        flight.departureCity
          .toLowerCase()
          .includes(tripInfo.departureCity.toLowerCase()) ||
        flight.departureAirport
          .toLowerCase()
          .includes(tripInfo.departureCity.toLowerCase());

      const matchTo =
        !tripInfo.destination ||
        flight.arrivalCity
          .toLowerCase()
          .includes(tripInfo.destination.toLowerCase()) ||
        flight.arrivalAirport
          .toLowerCase()
          .includes(tripInfo.destination.toLowerCase());

      return matchFrom && matchTo;
    });
  }, [hasSearched, tripInfo.departureCity, tripInfo.destination]);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 600);
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelections({ flight });
    setTripInfo({
      departureCity: `${flight.departureCity} (${flight.departureAirport})`,
      destination: flight.arrivalCity,
      departureDate: flight.departureTime.split("T")[0],
    });

    // sync form state
    form.setFieldValue(
      "departureCity",
      `${flight.departureCity} (${flight.departureAirport})`,
    );
    form.setFieldValue("destination", flight.arrivalCity);
    form.setFieldValue("departureDate", flight.departureTime.split("T")[0]);
    onNext();
  };

  const handleSkip = () => {
    setSelections({ flight: null });
    onNext();
  };

  // helper to sync both form + store on field change
  const updateField = (field: keyof TripFormValues, value: string | number) => {
    form.setFieldValue(field, value as never);
    setTripInfo({ [field]: value });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const totalTravelers =
    tripInfo.adults + tripInfo.children + (tripInfo.infants || 0);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-medium uppercase tracking-tight">
          Find Your Flight
        </h2>
        <p className="text-muted-foreground font-light">
          Start your journey with the best flight options to Rwanda.
        </p>
      </div>

      <div className="bg-muted/30 p-6 rounded-xl border border-border space-y-6">
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
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
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
                <Label>Departure</Label>
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
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="returnDate">
            {(field) => (
              <div className="space-y-2">
                <Label>Return (Optional)</Label>
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
        </div>

        <Button
          size="lg"
          className="w-full md:w-auto"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <RiSearchLine className="animate-spin size-4" /> Searching...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RiSearchLine className="size-4" /> Search Flights
            </span>
          )}
        </Button>
      </div>

      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {filteredFlights.length} Flights Found
            </h3>
            <div className="text-sm text-muted-foreground flex gap-4">
              <span>Prices per person</span>
            </div>
          </div>

          {filteredFlights.length > 0 ? (
            <div className="grid gap-4">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className={cn(
                    "bg-card p-6 rounded-xl border transition-all duration-200",
                    selections.flight?.id === flight.id
                      ? "border-primary ring-1 ring-primary/20 shadow-md"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">
                          {flight.airline}
                        </span>
                        <span className="text-muted-foreground text-sm bg-muted px-2 py-0.5 rounded-full">
                          {flight.cabinClass}
                        </span>
                      </div>

                      <div className="flex items-center gap-8">
                        <div>
                          <div className="text-2xl font-display font-medium">
                            {formatTime(flight.departureTime)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {flight.departureAirport}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            {flight.duration}
                          </div>
                          <div className="w-full h-px bg-border relative">
                            <RiPlaneLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 text-muted-foreground rotate-90 bg-card px-1" />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {flight.stops === 0
                              ? "Direct"
                              : `${flight.stops} Stops`}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-display font-medium">
                            {formatTime(flight.arrivalTime)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {flight.arrivalAirport}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:border-l border-border md:pl-6 flex md:flex-col items-center justify-between md:items-end gap-4 min-w-[140px]">
                      <div className="text-right">
                        <div className="text-2xl font-display font-bold">
                          ${flight.price}
                        </div>
                        {flight.seatsAvailable && flight.seatsAvailable < 5 && (
                          <div className="text-xs text-amber-500 font-medium">
                            {flight.seatsAvailable} seats left
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handleSelectFlight(flight)}
                        variant={
                          selections.flight?.id === flight.id
                            ? "secondary"
                            : "default"
                        }
                        className="w-full md:w-auto"
                      >
                        {selections.flight?.id === flight.id ? (
                          <span className="flex items-center gap-2">
                            <RiCheckLine className="size-4" /> Selected
                          </span>
                        ) : (
                          "Select"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <RiPlaneLine className="size-10 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No flights found</h3>
              <p className="text-muted-foreground">
                Try changing your search criteria
              </p>
            </div>
          )}
        </motion.div>
      )}

      {!hasSearched && (
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip flights
          </Button>
          <Button
            onClick={handleSearch}
            disabled={!tripInfo.departureCity || !tripInfo.departureDate}
          >
            Find Flights <RiArrowRightLine className="ml-2 size-4" />
          </Button>
        </div>
      )}

      {hasSearched && (
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Button variant="ghost" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      )}
    </div>
  );
}
