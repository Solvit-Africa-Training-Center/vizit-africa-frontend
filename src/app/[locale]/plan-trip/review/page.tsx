"use client";

import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiCheckLine,
  RiMapPinLine,
  RiUserLine,
} from "@remixicon/react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { submitTripRequest } from "@/actions/bookings";
import { ItineraryItem } from "@/components/shared/itinerary-item";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import type { TripItem } from "@/lib/plan_trip-types";
import { buildValidationErrorMessage } from "@/lib/validation/error-message";
import { useTripStore } from "@/store/trip-store";

export default function TripReviewPage() {
  const tCommon = useTranslations("Common");
  const { tripInfo, items, removeItem, updateTripInfo, clearTrip, updateItem } =
    useTripStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
console.log({tripInfo, items})
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitTripRequest({ ...tripInfo, items });
      if (result.success) {
        setSubmitted(true);
        toast.success("Trip request submitted successfully!");
        clearTrip();
      } else {
        toast.error(
          buildValidationErrorMessage({
            fieldErrors: result.fieldErrors,
            fallback: result.error || "Failed to submit trip request",
          }),
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <RiCheckLine className="size-10" />
          </div>
          <h1 className="text-3xl font-display font-medium">
            Request Received!
          </h1>
          <p className="text-muted-foreground">
            Thank you, {tripInfo.name}. We have received your trip request for{" "}
            {items.length} items. Our team will review your itinerary and get
            back to you shortly at {tripInfo.email}.
          </p>
          <div className="pt-8">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-8">
        <Link
          href="/plan-trip"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
        >
          <RiArrowLeftLine className="size-4" />
          {tCommon("back")}
        </Link>
      </div>
      <PageHeader
        title="Review Your Trip"
        overline="Itinerary"
        description="Review your selected experiences and finalize your request."
        className="mb-12"
      />

      <div className="max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-12">
        {/* left - itinerary items */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-medium">
              Your Selection ({items.length})
            </h2>
            <Link href="/services">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
              >
                + Add More
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 border border-dashed border-border rounded-xl text-center space-y-4"
                >
                  <p className="text-muted-foreground">Your trip is empty.</p>
                  <Link href="/">
                    <Button>Explore Experiences</Button>
                  </Link>
                </motion.div>
              ) : (
                items.map((item) => (
                  <ItineraryItem
                    key={item.id}
                    item={item as unknown as Record<string, unknown>}
                    defaultValues={{
                      startDate: tripInfo.arrivalDate || undefined,
                      endDate: tripInfo.departureDate || undefined,
                      startTime: tripInfo.arrivalTime || undefined,
                      endTime: tripInfo.departureTime || undefined,
                      returnDate: tripInfo.returnDate || undefined,
                      returnTime: tripInfo.returnTime || undefined,
                    }}
                    onRemove={() => removeItem(item.id)}
                    onUpdate={(updates) =>
                      updateItem(item.id, updates as Partial<TripItem>)
                    }
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* right - trip details and contact form */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 md:p-8 sticky top-24">
            <h3 className="font-display font-medium text-lg mb-6 uppercase tracking-wider text-muted-foreground">
              Trip Details
            </h3>

            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Destination
                  </Label>
                  <div className="font-medium flex items-center gap-2">
                    <RiMapPinLine className="size-4 text-primary" />
                    {tripInfo.destination || "Not set"}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Origin / Departing From
                  </Label>
                  <div className="font-medium flex items-center gap-2">
                    <RiMapPinLine className="size-4 text-muted-foreground" />
                    {tripInfo.departureCity || "TBD"}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Arrival in Rwanda
                  </Label>
                  <div className="font-medium flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <RiCalendarLine className="size-4 text-primary" />
                      {tripInfo.arrivalDate
                        ? format(new Date(tripInfo.arrivalDate), "MMM d, yyyy")
                        : "TBD"}
                    </div>
                    {tripInfo.arrivalTime && (
                      <div className="text-xs text-muted-foreground ml-6">
                        at {tripInfo.arrivalTime}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Departure / Return
                  </Label>
                  <div className="font-medium flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <RiCalendarLine className="size-4 text-primary" />
                      {tripInfo.departureDate
                        ? format(
                            new Date(tripInfo.departureDate),
                            "MMM d, yyyy",
                          )
                        : "TBD"}
                    </div>
                    {tripInfo.departureTime && (
                      <div className="text-xs text-muted-foreground ml-6">
                        at {tripInfo.departureTime}
                      </div>
                    )}
                  </div>
                </div>

                {tripInfo.isRoundTrip && tripInfo.returnDate && (
                  <div className="space-y-1 col-span-2 bg-primary/5 p-2 rounded-lg border border-primary/10">
                    <Label className="text-[10px] uppercase text-primary font-bold">
                      Round Trip Return
                    </Label>
                    <div className="font-medium flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RiCalendarLine className="size-4 text-primary" />
                        {format(new Date(tripInfo.returnDate), "MMM d, yyyy")}
                      </div>
                      {tripInfo.returnTime && (
                        <div className="text-xs text-muted-foreground">
                          at {tripInfo.returnTime}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Travelers
                  </Label>
                  <div className="font-medium flex items-center gap-2">
                    <RiUserLine className="size-4 text-primary" />
                    {tripInfo.adults} Ad, {tripInfo.children} Ch,{" "}
                    {tripInfo.infants} Inf
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Purpose
                  </Label>
                  <div className="font-medium capitalize">
                    {tripInfo.tripPurpose}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Label className="text-xs uppercase text-muted-foreground mb-2 block">
                  Assistance Requested For
                </Label>
                <div className="flex flex-wrap gap-2">
                  {tripInfo.needsFlights && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                      Flights
                    </span>
                  )}
                  {tripInfo.needsHotel && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">
                      Hotels
                    </span>
                  )}
                  {tripInfo.needsCar && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase">
                      Car Rental
                    </span>
                  )}
                  {tripInfo.needsGuide && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                      Local Guide
                    </span>
                  )}
                </div>
              </div>

              {(tripInfo.preferredCabinClass ||
                tripInfo.hotelStarRating ||
                tripInfo.carTypePreference) && (
                <div className="pt-4 border-t border-border/50">
                  <Label className="text-xs uppercase text-muted-foreground mb-3 block">
                    Detailed Preferences
                  </Label>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    {tripInfo.preferredCabinClass && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Cabin
                        </span>
                        <span className="font-medium capitalize">
                          {tripInfo.preferredCabinClass.replace("_", " ")}
                        </span>
                      </div>
                    )}
                    {tripInfo.hotelStarRating && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Hotel Stars
                        </span>
                        <span className="font-medium">
                          {tripInfo.hotelStarRating === "any"
                            ? "Any Verified"
                            : `${tripInfo.hotelStarRating} Stars`}
                        </span>
                      </div>
                    )}
                    {tripInfo.carTypePreference && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Vehicle
                        </span>
                        <span className="font-medium capitalize">
                          {tripInfo.carTypePreference}
                        </span>
                      </div>
                    )}
                    {tripInfo.guideLanguages &&
                      tripInfo.guideLanguages.length > 0 && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground uppercase">
                            Languages
                          </span>
                          <span className="font-medium">
                            {tripInfo.guideLanguages.join(", ")}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={tripInfo.name}
                  onChange={(e) => updateTripInfo({ name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={tripInfo.email}
                  onChange={(e) => updateTripInfo({ email: e.target.value })}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={tripInfo.phone}
                  onChange={(e) => updateTripInfo({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialRequests">
                  Special Requests / Notes
                </Label>
                <Textarea
                  id="specialRequests"
                  value={tripInfo.specialRequests}
                  onChange={(e) =>
                    updateTripInfo({ specialRequests: e.target.value })
                  }
                  placeholder="Dietary restrictions, accessibility needs, etc."
                  className="min-h-[100px]"
                />
              </div>

              <div className="pt-4 border-t border-border/50 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-medium">Estimated Total</span>
                  <span className="font-display font-bold text-2xl text-primary">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base font-bold uppercase tracking-wide h-12"
                  disabled={isSubmitting || items.length === 0}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  No payment required now. We'll contact you to finalize
                  details.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
