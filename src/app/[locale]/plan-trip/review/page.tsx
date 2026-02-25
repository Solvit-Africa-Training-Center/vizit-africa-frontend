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
        id: item.id,
        item_type: item.type,
        title: item.title,
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: Number(item.price) || 0,
        subtotal: (Number(item.price) || 0) * (item.quantity || 1),
        start_date: item.startDate || tripInfo.arrivalDate,
        end_date: item.endDate || tripInfo.departureDate,
        metadata: item.metadata,
      }));

      const submissionData = {
        ...tripInfo,
        items: mappedItems,
        preferredCabinClass: tripInfo.preferredCabinClass ?? undefined,
        hotelStarRating: tripInfo.hotelStarRating ?? undefined,
        carTypePreference: tripInfo.carTypePreference ?? undefined,
        startDate: tripInfo.startDate ?? undefined,
        endDate: tripInfo.endDate ?? undefined,
        departureDate: tripInfo.departureDate ?? undefined,
        returnDate: tripInfo.returnDate ?? undefined,
        arrivalDate: tripInfo.arrivalDate ?? undefined,
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
    <div className="min-h-screen bg-background pt-32 pb-24 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/plan-trip"
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-xs font-bold uppercase tracking-widest"
          >
            <RiArrowLeftLine className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to Builder
          </Link>
          <Badge variant="outline" className="font-mono text-[10px] py-1 border-primary/20 text-primary">
            Step 3: Final Narrative Review
          </Badge>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left: Detailed Itinerary */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight leading-none">
                Review Your <br /><span className="text-primary">Narrative</span>
              </h1>
              <p className="text-muted-foreground text-lg font-light max-w-xl">
                Fine-tune your selections before our concierge team begins crafting your personalized African journey.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <h2 className="font-display text-2xl font-medium flex items-center gap-3">
                  <RiSuitcaseLine className="size-6 text-primary" />
                  Your Selections
                  <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {items.length}
                  </span>
                </h2>
                <Link href="/plan-trip">
                  <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest hover:bg-primary/5 hover:text-primary">
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
                        <p className="text-lg font-medium">Your itinerary is empty</p>
                        <p className="text-sm text-muted-foreground">Add some magic to your trip to get started.</p>
                      </div>
                      <Link href="/plan-trip">
                        <Button className="rounded-full px-8 h-12">Explore Services</Button>
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
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-primary/5 space-y-10">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-medium">The Summary</h3>
                  <RiInformationLine className="size-6 text-primary/40" />
                </div>

                {/* Condensed Logistics Info */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-muted/30 p-6 rounded-2xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Destination</p>
                    <p className="font-medium text-sm flex items-center gap-2 truncate">
                      <RiMapPinLine className="size-3.5 text-primary" />
                      {tripInfo.destination || "Kigali, Rwanda"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Travelers</p>
                    <p className="font-medium text-sm flex items-center gap-2">
                      <RiUserLine className="size-3.5 text-primary" />
                      {tripInfo.travelers} Adventurers
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Budget Level</p>
                    <p className="font-medium text-sm capitalize">
                      {tripInfo.budgetBracket?.replace("-", " ") || "Mid Range"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Trip Style</p>
                    <p className="font-medium text-sm capitalize">
                      {tripInfo.tripPurpose || "Leisure"}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2 pt-2 border-t border-border/30">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Journey Timeline</p>
                    <p className="font-medium text-sm flex items-center gap-2">
                      <RiCalendarLine className="size-3.5 text-primary" />
                      {tripInfo.arrivalDate ? format(parseISO(tripInfo.arrivalDate), "MMM d") : "TBD"} — {tripInfo.departureDate ? format(parseISO(tripInfo.departureDate), "MMM d, yyyy") : "TBD"}
                    </p>
                  </div>
                </div>

                {/* Final Contact Identity */}
                <form className="space-y-5" id="final-review-form" onSubmit={handleManualTrigger}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Full Name</Label>
                      <Input
                        value={tripInfo.name}
                        onChange={(e) => updateTripInfo({ name: e.target.value })}
                        required
                        className="bg-muted/20 border-border/40 h-12 text-base rounded-xl"
                        placeholder="Sarah Johnson"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Email Address</Label>
                      <Input
                        type="email"
                        value={tripInfo.email}
                        onChange={(e) => updateTripInfo({ email: e.target.value })}
                        required
                        className="bg-muted/20 border-border/40 h-12 text-base rounded-xl"
                        placeholder="sarah@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Special Narrative (Optional)</Label>
                      <Textarea
                        value={tripInfo.specialRequests}
                        onChange={(e) => updateTripInfo({ specialRequests: e.target.value })}
                        className="bg-muted/20 border-border/40 min-h-[100px] text-sm rounded-2xl resize-none p-4 font-light"
                        placeholder="Dietary needs, preferred guides, or a specific occasion..."
                      />
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estimated Total</p>
                        <p className="font-display text-4xl font-medium text-primary">${totalPrice.toLocaleString()}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic text-right max-w-32 leading-tight">
                        Subject to concierge verification
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full h-16 text-lg font-bold shadow-xl shadow-primary/20 group"
                      disabled={isSubmitting || items.length === 0}
                    >
                      {isSubmitting ? (
                        "Crafting..."
                      ) : (
                        <span className="flex items-center gap-2">
                          Finalize Concierge Request
                          <RiSendPlaneLine className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
        <AlertDialogContent className="rounded-[2.5rem] p-8 md:p-12 max-w-xl border-border/50">
          <AlertDialogHeader className="space-y-6">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
              <RiPlaneLine className="size-8" />
            </div>
            <div className="text-center space-y-2">
              <AlertDialogTitle className="font-display text-3xl font-medium">Ready to embark?</AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground leading-relaxed">
                By submitting, our concierge team will begin manually sourcing the best available fares and exclusive stays for your journey. You will receive a finalized detailed quote within 48 hours.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 sm:justify-center gap-4">
            <AlertDialogCancel className="rounded-full px-8 h-12 border-border/50 hover:bg-muted font-bold text-xs uppercase tracking-widest">
              Review More
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleFinalSubmit}
              className="rounded-full px-8 h-12 font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              Confirm & Send Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
