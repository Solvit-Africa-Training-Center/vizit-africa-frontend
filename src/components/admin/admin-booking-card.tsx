"use client";

import { useState } from "react";
import {
  RiArrowRightLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiUserLine,
  RiRefund2Line,
} from "@remixicon/react";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefundModal } from "@/components/shared/payment";
import { type Booking } from "@/lib/unified-types";
import { useRouter } from "@/i18n/navigation";

interface AdminBookingCardProps {
  booking: Booking;
  t: any; // Translation function or object
}

export function AdminBookingCard({ booking, t }: AdminBookingCardProps) {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const router = useRouter();

  const hasFlight =
    booking.requestedItems?.some(
      (i: any) => i.type === "flight" || i.category === "flight",
    ) || booking.needsFlights;
  const hasHotel =
    booking.requestedItems?.some(
      (i: any) => i.type === "hotel" || i.category === "hotel",
    ) || booking.needsHotel;
  const hasCar =
    booking.requestedItems?.some(
      (i: any) => i.type === "car" || i.category === "car",
    ) || booking.needsCar;
  const hasGuide =
    booking.requestedItems?.some(
      (i: any) => i.type === "guide" || i.category === "guide",
    ) || booking.needsGuide;

  const handleRefundSuccess = () => {
    router.refresh();
  };

  const isPaid =
    booking.payment_status === "succeeded" ||
    booking.status === "paid" ||
    booking.status === "completed";

  return (
    <div className="bg-primary-foreground border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
      <div className="p-5 border-b border-border bg-linear-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">
            #{String(booking.id).toUpperCase().substring(0, 8)}
          </span>
          <div className="flex gap-2">
            {booking.payment_status === "succeeded" && (
              <span className="text-[10px] bg-success/10 text-success font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                Paid
              </span>
            )}
            <span
              className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded ${
                booking.status === "paid" || booking.status === "completed"
                  ? "bg-success/10 text-success"
                  : booking.status === "cancelled"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-warning/10 text-warning"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>
        <h3 className="font-display text-lg font-medium text-foreground mt-2">
          {booking.tripPurpose || "Trip Request"}
        </h3>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <RiUserLine className="size-4 text-muted-foreground" />
          <span className="text-foreground">
            {booking.name} • {booking.travelers} {t("card.travelers")}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RiCalendarLine className="size-4 text-muted-foreground" />
          <span className="text-foreground">
            {booking.arrivalDate ? formatDate(booking.arrivalDate) : "N/A"} -{" "}
            {booking.departureDate ? formatDate(booking.departureDate) : "N/A"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {hasFlight && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {t("card.badges.flight")}
            </span>
          )}
          {hasHotel && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {t("card.badges.hotel")}
            </span>
          )}
          {hasCar && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {t("card.badges.car")}
            </span>
          )}
          {hasGuide && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {t("card.badges.guide")}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-border bg-muted/30 space-y-3">
        <Link
          href={`/admin/bookings/${booking.id}/fulfill`}
          className="flex items-center justify-between text-sm font-medium text-primary hover:underline"
        >
          <span className="flex items-center gap-2">
            <RiCheckboxCircleLine className="size-4" />
            Manage Booking
          </span>
          <RiArrowRightLine className="size-4" />
        </Link>

        {isPaid && booking.status !== "cancelled" && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-0"
            onClick={() => setShowRefundModal(true)}
          >
            <RiRefund2Line className="size-4 mr-2" />
            Refund & Cancel
          </Button>
        )}
      </div>

      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        bookingId={String(booking.id)}
        amount={booking.total_amount || 0}
        currency={booking.currency || "USD"}
        guestName={booking.name}
        onRefundSuccess={handleRefundSuccess}
      />
    </div>
  );
}
