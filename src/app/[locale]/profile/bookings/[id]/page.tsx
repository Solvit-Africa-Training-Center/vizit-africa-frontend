"use client";

import {
  RiArrowLeftLine,
  RiCalendarEventLine,
  RiCarLine,
  RiCheckDoubleLine,
  RiCheckboxCircleLine,
  RiDownloadLine,
  RiFileListLine,
  RiGroupLine,
  RiHotelLine,
  RiInformationLine,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiPlaneLine,
  RiTimeLine,
  RiUser3Line,
} from "@remixicon/react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { acceptQuoteForBooking, getBookingById } from '@/actions/bookings';
import { Footer } from '@/components/landing';
import { Navbar } from '@/components/shared';
import { PaymentModal } from '@/components/shared/payment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ItineraryItem } from '@/components/shared/itinerary-item';
import { Link } from '@/i18n/navigation';
import type { Booking } from '@/lib/unified-types';
import { formatDate } from '@/lib/utils';
import { formatCurrency } from "@/lib/utils/quote-calculator";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusVariants: Record<string, any> = {
  pending: "secondary",
  quoted: "warning",
  confirmed: "success",
  cancelled: "destructive",
  completed: "editorial",
};

export default function BookingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const _t = useTranslations("Profile");
  const _tCommon = useTranslations("Common");
  const _router = useRouter();

  useEffect(() => {
    async function loadBooking() {
      try {
        const result = await getBookingById(id);
        if (result.success) {
          setBooking(result.data);
        } else {
          toast.error(result.error);
        }
      } catch (_error) {
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [id]);

  const handlePaymentSuccess = async () => {
    if (!booking) return;
    // After Stripe payment succeeds, confirm the booking
    try {
      const result = await acceptQuoteForBooking(String(booking.id));
      if (result.success) {
        toast.success("Payment received! Your booking is now confirmed.");
      } else {
        toast.error(result.error || "Payment processed but booking confirmation failed. Contact support.");
      }
    } catch (_error) {
      toast.error("Payment succeeded but confirmation failed. Contact support.");
    }
    const refresh = await getBookingById(id);
    if (refresh.success) {
      setBooking(refresh.data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center space-y-4 max-w-md px-6">
            <div className="size-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <RiFileListLine className="size-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-medium">
              Booking Not Found
            </h1>
            <p className="text-muted-foreground">
              We couldn't find the booking you're looking for. It might have
              been moved or deleted.
            </p>
            <Link href="/profile">
              <Button className="w-full">Return to Profile</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const quote = booking.quote;
  const isQuoted = booking.status === "quoted" && quote;
  const isPending = booking.status === "pending";
  const isConfirmed = booking.status === "confirmed";
  const isCompleted = booking.status === "completed";

  const showQuoteActions = isQuoted;
  const displayItems =
    isConfirmed || isCompleted ? booking.items : quote?.items || [];

  const totalAmount =
    isConfirmed || isCompleted
      ? booking.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
      : quote?.totalAmount || booking.total_amount || 0;

  const currency = (
    isConfirmed || isCompleted
      ? (booking.items[0]?.metadata?.currency as string) || booking.currency
      : quote?.currency || booking.currency || "USD"
  ) as string;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-5 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 mb-6 group"
            >
              <RiArrowLeftLine className="size-4 group-hover:-translate-x-1 transition-transform" />{" "}
              Back to My Trips
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                    {booking.tripPurpose || "African Adventure"}
                  </h1>
                  <Badge
                    variant={statusVariants[booking.status] || "secondary"}
                    className="px-3 py-1 uppercase tracking-wider font-bold"
                  >
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <RiFileListLine className="size-4" />
                    Ref: #{String(booking.id).toUpperCase().slice(0, 8)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RiCalendarEventLine className="size-4" />
                    Created on {formatDate(booking.createdAt)}
                  </span>
                </div>
              </div>

              {showQuoteActions && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none"
                  >
                    Decline Quote
                  </Button>
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    className="flex-1 md:flex-none shadow-lg shadow-primary/20"
                  >
                    <span className="flex items-center gap-2">
                      <RiCheckboxCircleLine className="size-5" />
                      Accept & Pay
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              {isQuoted && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <RiInformationLine className="size-24" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-display font-medium text-amber-600 mb-2 flex items-center gap-2">
                      <RiInformationLine className="size-5" />
                      Custom Quote Prepared
                    </h3>
                    <p className="text-sm text-amber-900/80 leading-relaxed max-w-2xl">
                      Our travel specialists have manually sourced the best
                      fares and availability for your request. Please review the
                      itinerary and finalized pricing below. Accept to secure
                      your booking.
                    </p>
                    {quote?.expiresAt && (
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-700 uppercase tracking-wider">
                        <RiTimeLine className="size-3.5" />
                        Expires: {formatDate(quote.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isPending && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <h3 className="text-lg font-display font-medium text-primary mb-2 flex items-center gap-2">
                    <RiTimeLine className="size-5" />
                    Request Being Processed
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    We've received your trip plan! Our experts are currently
                    checking real-time availability and fares. You'll receive a
                    notificaiton once your custom quote is ready for review.
                  </p>
                </div>
              )}

              {isConfirmed && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-display font-medium text-emerald-600 mb-2 flex items-center gap-2">
                    <RiCheckDoubleLine className="size-5" />
                    Booking Confirmed
                  </h3>
                  <p className="text-sm text-emerald-900/80 leading-relaxed mb-4">
                    Your trip is officially booked and confirmed!
                    {booking.payment_status === "succeeded"
                      ? " Your payment has been received."
                      : " Please complete the payment to finalize your adventure."}
                  </p>
                  {booking.payment_status !== "succeeded" && (
                    <Button
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <RiCheckboxCircleLine className="size-5 mr-2" />
                      Complete Payment
                    </Button>
                  )}
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-medium">
                    Itinerary Details
                  </h2>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {displayItems.length}{" "}
                    {displayItems.length === 1 ? "Item" : "Items"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {displayItems.length > 0 ? (
                    displayItems.map((item, index: number) => (
                      <ItineraryItem
                        key={item.id || index}
                        item={item}
                        mode="view"
                      />
                    ))
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
                      <RiFileListLine className="size-10 text-muted-foreground/40 mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">
                        No item details available yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {booking.specialRequests && (
                <div className="bg-card border border-border/50 rounded-2xl p-6">
                  <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                    <RiInformationLine className="size-5 text-primary" />
                    Special Requests
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed italic text-foreground/80">
                    "{booking.specialRequests}"
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
                <h3 className="font-display text-lg font-medium mb-6 relative z-10">
                  Trip Overview
                </h3>
                <div className="space-y-5 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <RiMapPin2Line className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Destination
                      </p>
                      <p className="font-medium">
                        {booking.requestedItems?.[0]?.title ||
                          booking.tripPurpose ||
                          "Rwanda"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <RiCalendarEventLine className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Dates
                      </p>
                      <p className="font-medium">
                        {booking.arrivalDate
                          ? formatDate(booking.arrivalDate)
                          : "TBD"}
                        {booking.departureDate &&
                          ` — ${formatDate(booking.departureDate)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <RiGroupLine className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Travelers
                      </p>
                      <p className="font-medium">
                        {booking.adults} Adults
                        {booking.children > 0 &&
                          `, ${booking.children} Children`}
                        {booking.infants > 0 && `, ${booking.infants} Infants`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-lg font-medium mb-6">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="size-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 text-primary">
                      <RiUser3Line className="size-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Full Name
                      </p>
                      <p className="font-medium truncate">{booking.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 text-primary">
                      <RiMailLine className="size-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Email
                      </p>
                      <p className="font-medium truncate">{booking.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 text-primary">
                      <RiPhoneLine className="size-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Phone
                      </p>
                      <p className="font-medium truncate">
                        {booking.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-foreground text-background rounded-2xl p-6 shadow-xl shadow-foreground/10 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
                  <RiCheckDoubleLine className="size-32" />
                </div>
                <h3 className="font-display text-lg font-medium mb-6 relative z-10">
                  Pricing Summary
                </h3>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm opacity-70">
                    <span>Base Amount</span>
                    <span>
                      {formatCurrency(totalAmount, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm opacity-70">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <Separator className="bg-background/20 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Price</span>
                    <span className="font-display text-2xl font-bold">
                      {formatCurrency(totalAmount, currency)}
                    </span>
                  </div>
                </div>

                {isConfirmed && (
                  <div className="mt-8 pt-6 border-t border-background/20 relative z-10">
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-2 bg-transparent border-background/40 hover:bg-background/10 text-background"
                    >
                      <RiDownloadLine className="size-4" />
                      Download Itinerary
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {booking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={totalAmount}
          currency={currency}
          bookingId={String(booking.id)}
          clientEmail={booking.email}
          travelerName={booking.name}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
