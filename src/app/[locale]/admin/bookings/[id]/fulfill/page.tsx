"use client";

import { sampleBookings } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import {
  RiCheckDoubleLine,
  RiFileListLine,
  RiPlaneLine,
  RiHotelLine,
  RiCarLine,
  RiMailSendLine,
  RiDownloadLine,
  RiArrowLeftLine,
} from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FulfillmentPage() {
  const booking = sampleBookings[0];
  const t = useTranslations("Admin.bookings.fulfill");
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
              <span className="text-sm font-sans font-normal bg-green-100 text-green-700 px-2 py-1 rounded">
                {t("paid")}
              </span>
            </h1>
            <p className="text-muted-foreground">
              Booking #{booking.id.toUpperCase()} •{" "}
              {booking.selectedFlight?.airline} trip for Sarah Johnson
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RiDownloadLine /> {t("downloadInvoice")}
            </Button>
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
                    RwandAir WB500 (NBO-KGL)
                  </p>
                </div>
                <RiPlaneLine className="size-5 text-muted-foreground" />
              </label>

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
                    Kigali Marriott Hotel (5 Nights)
                  </p>
                </div>
                <RiHotelLine className="size-5 text-muted-foreground" />
              </label>

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
                    Toyota RAV4 with Driver
                  </p>
                </div>
                <RiCarLine className="size-5 text-muted-foreground" />
              </label>

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
                    Jean-Pierre Uwimana assigned
                  </p>
                </div>
                <RiFileListLine className="size-5 text-muted-foreground" />
              </label>

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
                <p className="font-medium">Sarah Johnson</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("customer.email")}</p>
                <p className="font-medium">sarah.j@example.com</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("customer.phone")}</p>
                <p className="font-medium">+1 (555) 0123</p>
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
                <span className="font-medium">$2,520.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("payment.method")}
                </span>
                <span className="font-medium">Credit Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("payment.date")}
                </span>
                <span className="font-medium">Feb 04, 2025</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs font-medium uppercase">
                  {t("payment.status")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
