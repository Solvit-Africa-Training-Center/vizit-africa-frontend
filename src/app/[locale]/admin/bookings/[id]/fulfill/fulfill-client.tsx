"use client";

import {
  RiArrowLeftLine,
  RiCarLine,
  RiCheckDoubleLine,
  RiDownloadLine,
  RiFileListLine,
  RiHotelLine,
  RiMailSendLine,
  RiPlaneLine,
  RiRefundLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefundModal } from "@/components/shared/payment";
import { Link } from "@/i18n/navigation";
import { bookingSchema, type Booking } from "@/lib/unified-types";
import { formatDate } from "@/lib/utils";

interface FulfillClientProps {
  booking: Booking;
}

export default function FulfillClient({ booking }: FulfillClientProps) {
  const t = useTranslations("Admin.bookings.fulfill");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [checklist, setChecklist] = useState({
    flightTickets: false,
    hotelConfirmation: false,
    carVoucher: false,
    guideItinerary: false,
    finalItinerarySent: false,
  });

  const toggleItem = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const progress =
    (Object.values(checklist).filter(Boolean).length /
      Object.keys(checklist).length) *
    100;

  // Helpers to find items
  const flightItem = booking.requestedItems?.find(
    (i: any) => i.type === "flight" || i.category === "flight",
  );
  const hotelItem = booking.requestedItems?.find(
    (i: any) => i.type === "hotel" || i.category === "hotel",
  );
  const carItem = booking.requestedItems?.find(
    (i: any) => i.type === "car" || i.category === "car",
  );
  const guideItem = booking.requestedItems?.find(
    (i: any) => i.type === "guide" || i.category === "guide",
  );

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-10 py-8">
      <div className="mb-8">
        <Link
          href="/admin/bookings"
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
        >
          <RiArrowLeftLine className="size-4" /> {t("back")}
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
              {t("title")}
              <span
                className={`text-sm font-sans font-normal px-2 py-1 rounded ${booking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {booking.status}
              </span>
            </h1>
            <p className="text-muted-foreground">
              Booking #{String(booking.id).toUpperCase().substring(0, 8)} •{" "}
              {booking.tripPurpose || "Trip"} for {booking.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RiDownloadLine /> {t("downloadInvoice")}
            </Button>
            {(booking.status === "confirmed" ||
              booking.status === "completed") && (
              <Button
                variant="destructive"
                onClick={() => setShowRefundModal(true)}
              >
                <RiRefundLine className="size-4 mr-2" />
                Refund Booking
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-primary-foreground border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-medium">{t("progress.title")}</h3>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-success transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-primary-foreground border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-medium flex items-center gap-2">
                <RiFileListLine className="size-5 text-primary" />
                {t("actions.title")}
              </h3>
            </div>
            <div className="divide-y divide-border">
              {booking.needsFlights && (
                <label className="flex items-center gap-4 p-4 hover:bg-muted/10 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.flightTickets}
                    onChange={() => toggleItem("flightTickets")}
                    className="size-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {t("actions.uploadTickets")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flightItem?.title || "Flight details pending"}
                    </p>
                  </div>
                  <RiPlaneLine className="size-5 text-muted-foreground" />
                </label>
              )}

              {booking.needsHotel && (
                <label className="flex items-center gap-4 p-4 hover:bg-muted/10 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.hotelConfirmation}
                    onChange={() => toggleItem("hotelConfirmation")}
                    className="size-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {t("actions.confirmHotel")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {hotelItem?.title || "Hotel details pending"}
                    </p>
                  </div>
                  <RiHotelLine className="size-5 text-muted-foreground" />
                </label>
              )}

              {booking.needsCar && (
                <label className="flex items-center gap-4 p-4 hover:bg-muted/10 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.carVoucher}
                    onChange={() => toggleItem("carVoucher")}
                    className="size-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {t("actions.issueCarVoucher")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {carItem?.title || "Car rental details pending"}
                    </p>
                  </div>
                  <RiCarLine className="size-5 text-muted-foreground" />
                </label>
              )}

              {booking.needsGuide && (
                <label className="flex items-center gap-4 p-4 hover:bg-muted/10 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.guideItinerary}
                    onChange={() => toggleItem("guideItinerary")}
                    className="size-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {t("actions.finalizeItinerary")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {guideItem?.title || "Guide details pending"}
                    </p>
                  </div>
                  <RiFileListLine className="size-5 text-muted-foreground" />
                </label>
              )}

              <label className="flex items-center gap-4 p-4 hover:bg-muted/10 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.finalItinerarySent}
                  onChange={() => toggleItem("finalItinerarySent")}
                  className="size-5 rounded border-border text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {t("actions.sendDocuments")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email with all attachments
                  </p>
                </div>
                <RiMailSendLine className="size-5 text-muted-foreground" />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="lg" disabled={progress < 100}>
              <RiCheckDoubleLine />
              {t("actions.complete")}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary-foreground border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">{t("customer.title")}</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("customer.name")}</p>
                <p className="font-medium">{booking.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("customer.email")}</p>
                <p className="font-medium">{booking.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("customer.phone")}</p>
                <p className="font-medium">{booking.phone || "-"}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-foreground border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">{t("payment.title")}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("payment.total")}
                </span>
                <span className="font-medium">
                  {booking.quote?.currency}{" "}
                  {booking.quote?.totalAmount?.toLocaleString() || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("payment.method")}
                </span>
                <span className="font-medium">Credit Card</span>{" "}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("payment.date")}
                </span>
                <span className="font-medium">
                  {booking.createdAt ? formatDate(booking.createdAt) : "-"}
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium uppercase ${booking.status === "confirmed" ? "text-green-700 bg-green-100" : "text-yellow-700 bg-yellow-100"}`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        bookingId={String(booking.id)}
        amount={booking.total_amount || 0}
        currency={booking.currency || "USD"}
        guestName={booking.name}
        onRefundSuccess={() => {
          // Optionally reload or update booking
          window.location.reload();
        }}
      />
    </div>
  );
}
