"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils";
import { getBookingById, acceptQuoteForBooking } from "@/actions/bookings";
import type { Booking } from "@/lib/schema/booking-schema";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import {
  RiArrowLeftLine,
  RiCheckDoubleLine,
  RiDownloadLine,
  RiFileListLine,
  RiPlaneLine,
  RiHotelLine,
  RiCarLine,
  RiUserLine,
  RiInformationLine,
} from "@remixicon/react";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const t = useTranslations("Profile"); // Reuse generic profile translations or create specific ones if needed
  const router = useRouter();

  useEffect(() => {
    async function loadBooking() {
      try {
        const result = await getBookingById(id);
        if (result.success) {
          setBooking(result.data);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [id]);

  const handleAcceptQuote = async () => {
    if (!booking) return;
    setProcessing(true);
    try {
      const result = await acceptQuoteForBooking(booking.id);
      if (result.success) {
        toast.success("Quote accepted successfully! Your trip is confirmed.");
        // Refresh booking data
        const refresh = await getBookingById(id);
        if (refresh.success) {
          setBooking(refresh.data);
        }
      } else {
        toast.error(result.error || "Failed to accept quote");
      }
    } catch (error) {
      toast.error("An error occurred while accepting the quote");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
            <Link href="/profile">
              <Button>Return to Profile</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const quote = booking.quote;
  const showQuote =
    (booking.status === "quoted" || booking.status === "pending") && quote;
  const showItinerary =
    booking.status === "confirmed" || booking.status === "completed";

  // If confirmed, items are in booking.items. If quoted, items are in quote.items
  const displayItems = showItinerary ? booking.items : quote?.items || [];

  const totalAmount = showItinerary
    ? booking.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    : quote?.total_amount || 0;

  const currency = (
    showItinerary
      ? (booking.items[0]?.metadata?.currency as string) || "USD" // Fallback, though ideally booking has currency
      : quote?.currency || "USD"
  ) as string;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-5 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
            >
              <RiArrowLeftLine className="size-4" /> Back to Profile
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground flex items-center gap-3">
                  {booking.tripPurpose || "Trip Details"}
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "success" : "secondary"
                    }
                  >
                    {booking.status}
                  </Badge>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Booking #{booking.id.toUpperCase().slice(0, 8)} •{" "}
                  {formatDate(booking.createdAt)}
                </p>
              </div>

              {showQuote && (
                <div className="flex gap-3">
                  <Button variant="outline" disabled={processing}>
                    Decline
                  </Button>
                  <Button onClick={handleAcceptQuote} disabled={processing}>
                    {processing ? "Processing..." : "Accept Quote & Confirm"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Status Banner */}
              {showQuote && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                    <RiInformationLine className="size-5" />
                    Quote Ready for Review
                  </h3>
                  <p className="text-sm text-foreground/80">
                    We have prepared a custom quote for your trip based on your
                    requirements. Please review the details below. This quote is
                    valid for 48 hours.
                  </p>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-4">
                <h2 className="text-xl font-display font-medium">
                  Itinerary Details
                </h2>
                {displayItems.length > 0 ? (
                  displayItems.map((item: any, index: number) => (
                    <div
                      key={item.id || index}
                      className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row gap-4"
                    >
                      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                        {item.type === "flight" ? (
                          <RiPlaneLine className="size-6" />
                        ) : item.type === "hotel" ? (
                          <RiHotelLine className="size-6" />
                        ) : item.type === "car" ? (
                          <RiCarLine className="size-6" />
                        ) : (
                          <RiFileListLine className="size-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">
                              {item.title || "Service Item"}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {currency} {item.unit_price?.toLocaleString()}
                            </p>
                            {item.quantity && item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                x{item.quantity}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Metadata display if needed */}
                        {item.metadata && (
                          <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(item.metadata).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <span className="text-muted-foreground capitalize">
                                    {key.replace("_", " ")}:{" "}
                                  </span>
                                  <span className="font-medium">
                                    {String(value)}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">
                      No items details available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-32">
                <h3 className="font-medium mb-4">Summary</h3>
                <div className="space-y-3 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {currency} {totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="font-medium text-lg">Total</span>
                  <span className="font-display text-2xl font-medium text-primary">
                    {currency} {totalAmount.toLocaleString()}
                  </span>
                </div>

                {showItinerary && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-medium mb-3">Documents</h4>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
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
    </div>
  );
}
