"use client";

import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiCheckLine,
  RiMapPinLine,
  RiUserLine,
  RiInformationLine,
  RiSuitcaseLine,
  RiPlaneLine,
  RiSendPlaneLine,
} from "@remixicon/react";
import { format, parseISO } from "date-fns";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useRouter } from "@/i18n/navigation";
import type { TripItem } from "@/lib/plan_trip-types";
import { buildValidationErrorMessage } from "@/lib/validation/error-message";
import { useTripStore } from "@/store/trip-store";
import { cn } from "@/lib/utils";

export default function TripReviewPage() {
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const { tripInfo, items, removeItem, updateTripInfo, clearTrip, updateItem } =
    useTripStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirm(false);

    try {
      const mappedItems = items.map((item) => ({
        type: item.type,
        title: item.title,
        description: item.description,
        quantity: item.quantity || 1,
        startDate: item.startDate || tripInfo.arrivalDate,
        endDate: item.endDate || tripInfo.departureDate,
        startTime: item.startTime,
        endTime: item.endTime,
        isRoundTrip: !!item.isRoundTrip || !!item.metadata?.isRoundTrip,
        withDriver: !!item.withDriver || !!item.metadata?.withDriver,
        metadata: item.metadata,
      }));

      const adults = Number(tripInfo.adults) || 1;
      const children = Number(tripInfo.children) || 0;
      const infants = Number(tripInfo.infants) || 0;
      const totalTravelers = adults + children + infants;

      const submissionData = {
        name: tripInfo.name,
        email: tripInfo.email,
        phoneNumber: tripInfo.phoneNumber,
        departureCity: tripInfo.departureCity || "",
        arrivalDate: tripInfo.arrivalDate || "",
        departureDate: tripInfo.departureDate || "",
        returnDate: tripInfo.returnDate || tripInfo.departureDate || "",
        adults: adults,
        children: children,
        infants: infants,
        travelers: totalTravelers,
        needsFlights: !!tripInfo.needsFlights,
        needsHotel: !!tripInfo.needsHotel,
        needsCar: !!tripInfo.needsCar,
        needsGuide: !!tripInfo.needsGuide,
        tripPurpose: tripInfo.tripPurpose,
        specialRequests: tripInfo.specialRequests,
        items: mappedItems,
      };

      const result = await submitTripRequest(submissionData as any);
      if (result.success) {
        setSubmitted(true);
        toast.success("Concierge request submitted!");
        clearTrip();
        // Redirect to confirmation with ID
        router.push(`/plan-trip/confirmation?id=${result.data.id}`);
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

  const handleManualTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one service to your trip.");
      return;
    }
    if (!tripInfo.name || !tripInfo.email) {
      toast.error("Please provide your name and email.");
      return;
    }
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/plan-trip"
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-[10px] sm:text-xs font-bold uppercase tracking-widest"
          >
            <RiArrowLeftLine className="size-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Builder
          </Link>
          <Badge
            variant="outline"
            className="font-mono text-[9px] py-0.5 px-2 border-primary/20 text-primary"
          >
            Step 3: Review
          </Badge>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Detailed Itinerary */}
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-none text-balance">
                Review Your <br className="hidden sm:block" />
                <span className="text-primary">Narrative</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light max-w-xl text-pretty">
                Fine-tune your selections before our concierge team begins
                crafting your personalized African journey.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h2 className="font-display text-xl sm:text-2xl font-medium flex items-center gap-2.5">
                  <RiSuitcaseLine className="size-5 sm:size-6 text-primary" />
                  Your Selections
                  <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {items.length}
                  </span>
                </h2>
                <Link href="/plan-trip">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[9px] sm:text-xs font-bold uppercase tracking-widest hover:bg-primary/5 hover:text-primary h-8 px-2"
                  >
                    + Add Extras
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-16 border-2 border-dashed border-border/50 rounded-3xl text-center space-y-6 bg-muted/5"
                    >
                      <RiSuitcaseLine className="size-12 mx-auto text-muted-foreground/20" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          Your itinerary is empty
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add some magic to your trip to get started.
                        </p>
                      </div>
                      <Link href="/plan-trip">
                        <Button className="rounded-full px-8 h-12">
                          Explore Services
                        </Button>
                      </Link>
                    </motion.div>
                  ) : (
                    items.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <ItineraryItem
                          item={item as any}
                          isDefaultOpen={true}
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
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Final Details & Confirm */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="bg-surface-ink text-white border border-primary/10 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden isolate space-y-8 md:space-y-10">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,oklch(65%_0.06_245/0.15)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl sm:text-2xl font-medium text-white uppercase tracking-tight">
                    The Summary
                  </h3>
                  <RiInformationLine className="size-5 sm:size-6 text-primary-light/40" />
                </div>

                {/* Condensed Logistics Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary-light/80">
                      Destination
                    </p>
                    <p className="font-medium text-sm flex items-center gap-2 truncate text-white">
                      <RiMapPinLine className="size-3.5 text-primary-light" />
                      {tripInfo.destination || "Kigali, Rwanda"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary-light/80">
                      Travelers
                    </p>
                    <p className="font-medium text-sm flex items-center gap-2 text-white">
                      <RiUserLine className="size-3.5 text-primary-light" />
                      {tripInfo.travelers} Adventurers
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary-light/80">
                      Trip Style
                    </p>
                    <p className="font-medium text-sm capitalize text-white">
                      {tripInfo.tripPurpose || "Leisure"}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary-light/80">
                      Journey Timeline
                    </p>
                    <p className="font-medium text-sm flex items-center gap-2 text-white">
                      <RiCalendarLine className="size-3.5 text-primary-light" />
                      {tripInfo.arrivalDate
                        ? format(parseISO(tripInfo.arrivalDate), "MMM d")
                        : "TBD"}{" "}
                      —{" "}
                      {tripInfo.departureDate
                        ? format(
                            parseISO(tripInfo.departureDate),
                            "MMM d, yyyy",
                          )
                        : "TBD"}
                    </p>
                  </div>
                </div>

                {/* Final Contact Identity */}
                <form
                  className="space-y-4 sm:space-y-5"
                  id="final-review-form"
                  onSubmit={handleManualTrigger}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
                        Full Name
                      </Label>
                      <Input
                        value={tripInfo.name}
                        onChange={(e) =>
                          updateTripInfo({ name: e.target.value })
                        }
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 sm:h-12 text-base rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
                        placeholder="Sarah Johnson"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        value={tripInfo.email}
                        onChange={(e) =>
                          updateTripInfo({ email: e.target.value })
                        }
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 sm:h-12 text-base rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
                        placeholder="sarah@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        value={tripInfo.phoneNumber}
                        onChange={(e) =>
                          updateTripInfo({ phoneNumber: e.target.value })
                        }
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 sm:h-12 text-base rounded-xl focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
                        placeholder="+250..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 ml-1">
                        Special Narrative (Optional)
                      </Label>
                      <Textarea
                        value={tripInfo.specialRequests}
                        onChange={(e) =>
                          updateTripInfo({ specialRequests: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px] sm:min-h-[100px] text-sm rounded-2xl resize-none p-4 font-light focus-visible:ring-primary-light/50 focus-visible:border-primary-light/50"
                        placeholder="Dietary needs, preferred guides, or a specific occasion..."
                      />
                    </div>
                  </div>

                  <Separator className="opacity-10 bg-white" />

                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex justify-between items-end gap-4">
                      <div className="space-y-0.5">
                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Estimated Total
                        </p>
                        <p className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-primary-light">
                          ${totalPrice.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-[8px] sm:text-[10px] text-primary-light/60 italic text-right max-w-[100px] sm:max-w-[120px] leading-tight pb-1">
                        Subject to concierge verification
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full h-14 sm:h-16 text-[10px] sm:text-xs uppercase tracking-widest font-sans font-semibold bg-primary hover:bg-primary/90 text-white border-0 shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-102 group"
                      disabled={isSubmitting || items.length === 0}
                    >
                      {isSubmitting ? (
                        "Crafting..."
                      ) : (
                        <span className="flex items-center gap-2">
                          Finalize Request
                          <RiSendPlaneLine className="size-4 sm:size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 max-w-lg border-border/50">
          <AlertDialogHeader className="space-y-4 sm:space-y-6">
            <div className="size-12 sm:size-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary mx-auto">
              <RiPlaneLine className="size-6 sm:size-8" />
            </div>
            <div className="text-center space-y-2">
              <AlertDialogTitle className="font-display text-2xl sm:text-3xl font-medium">
                Ready to embark?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                By submitting, our concierge team will begin manually sourcing
                the best available fares and exclusive stays for your journey.
                You will receive a finalized detailed quote within 48 hours.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 sm:mt-10 sm:justify-center gap-3 sm:gap-4 flex-col sm:flex-row">
            <AlertDialogCancel className="w-full sm:w-auto rounded-full px-6 sm:px-8 h-11 sm:h-12 border-border/50 hover:bg-muted font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-0!">
              Review More
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalSubmit}
              className="w-full sm:w-auto rounded-full px-6 sm:px-8 h-11 sm:h-12 font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              Confirm & Send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
