"use client";

import { useTripStore } from "@/store/trip-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { submitTripRequest } from "@/actions/bookings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  RiDeleteBinLine,
  RiCalendarLine,
  RiMapPinLine,
  RiUserLine,
  RiCheckLine,
  RiArrowRightLine,
} from "@remixicon/react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { TripItem } from "@/lib/plan_trip-types";
import { Switch } from "@/components/ui/switch";

export default function TripReviewPage() {
  const t = useTranslations("PlanTrip"); // Assuming we have these or similar keys
  const { tripInfo, items, removeItem, updateTripInfo, clearTrip, updateItem } =
    useTripStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Group items or just list them
  // Let's just list them for now but maybe sorted by type

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitTripRequest(tripInfo, items);
      if (result.success) {
        setSubmitted(true);
        toast.success("Trip request submitted successfully!");
        clearTrip();
      } else {
        toast.error(result.error || "Failed to submit trip request");
      }
    } catch (error) {
      console.error("Submission error:", error);
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
      <PageHeader
        title="Review Your Trip"
        overline="Itinerary"
        description="Review your selected experiences and finalize your request."
        className="mb-12"
      />

      <div className="max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-12">
        {/* Left: Itinerary Items */}
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
                  <TripItemCard
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                    onUpdate={(updates) => updateItem(item.id, updates)}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Trip Details & Contact Form */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 md:p-8 sticky top-24">
            <h3 className="font-display font-medium text-lg mb-6 uppercase tracking-wider text-muted-foreground">
              Trip Details
            </h3>

            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
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
                    Dates
                  </Label>
                  <div className="font-medium flex items-center gap-2">
                    <RiCalendarLine className="size-4 text-primary" />
                    {tripInfo.departureDate ? (
                      <span>
                        {format(new Date(tripInfo.departureDate), "MMM d")} -{" "}
                        {tripInfo.returnDate
                          ? format(new Date(tripInfo.returnDate), "MMM d, yyyy")
                          : "TBD"}
                      </span>
                    ) : (
                      "Not set"
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">
                  Travelers
                </Label>
                <div className="font-medium flex items-center gap-2">
                  <RiUserLine className="size-4 text-primary" />
                  {tripInfo.adults} Adults, {tripInfo.children} Children
                </div>
              </div>
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

function TripItemCard({
  item,
  onRemove,
  onUpdate,
}: {
  item: TripItem;
  onRemove: () => void;
  onUpdate: (updates: Partial<TripItem>) => void;
}) {
  const image =
    item.data?.image || item.data?.airlineLogo || "/images/placeholder.jpg";

  // Toggle editing
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="flex flex-col gap-4 bg-card border border-border/50 rounded-xl p-4 shadow-sm group hover:border-primary/20 transition-colors"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-32 h-32 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
          {item.type !== "note" && (
            <Image src={image} alt={item.title} fill className="object-cover" />
          )}
          {item.type === "note" && (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              <span className="text-4xl">📝</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-primary font-medium">
                  {item.type}
                </span>
                <h4 className="font-medium text-lg leading-tight">
                  {item.title}
                </h4>
              </div>
              {item.price ? (
                <span className="font-mono text-sm font-medium whitespace-nowrap">
                  ${item.price}
                </span>
              ) : null}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-muted-foreground flex gap-2">
              {item.startDate ? (
                <span>{new Date(item.startDate).toLocaleDateString()}</span>
              ) : (
                <span className="italic">Date flexible</span>
              )}
              {item.startTime && <span>at {item.startTime}</span>}
              {item.isRoundTrip && (
                <span className="text-primary font-medium">(Round Trip)</span>
              )}
            </div>

            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary text-xs"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Edit Details"}
            </Button>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col justify-end gap-2 border-t sm:border-t-0 sm:border-l border-border/50 pt-3 sm:pt-0 sm:pl-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
          >
            <RiDeleteBinLine className="size-4" />
          </Button>
        </div>
      </div>

      {isEditing && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-border/50 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Date</Label>
            <Input
              type="date"
              value={item.startDate || ""}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Time</Label>
            <Input
              type="time"
              value={item.startTime || ""}
              onChange={(e) => onUpdate({ startTime: e.target.value })}
            />
          </div>

          {(item.type === "flight" ||
            item.type === "car" ||
            item.type === "guide") && (
            <>
              <div className="sm:col-span-2 flex items-center justify-between py-2">
                <Label className="text-sm">Two-way / Round Trip</Label>
                <Switch
                  checked={item.isRoundTrip || false}
                  onCheckedChange={(checked) =>
                    onUpdate({ isRoundTrip: checked })
                  }
                />
              </div>

              {item.isRoundTrip && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Return Date
                  </Label>
                  <Input
                    type="date"
                    value={item.returnDate || ""}
                    onChange={(e) => onUpdate({ returnDate: e.target.value })}
                  />
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
