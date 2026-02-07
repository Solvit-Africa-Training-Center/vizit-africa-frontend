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

export default function FulfillmentPage() {
  const booking = sampleBookings[0];
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
          <RiArrowLeftLine className="size-4" /> Back to Bookings
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              Booking Fulfillment
              <span className="text-sm font-sans font-normal bg-green-100 text-green-700 px-2 py-1 rounded">
                Paid
              </span>
            </h1>
            <p className="text-muted-foreground">
              Booking #{booking.id.toUpperCase()} •{" "}
              {booking.selectedFlight?.airline} trip for Sarah Johnson
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RiDownloadLine /> Download Invoice
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold">Fulfillment Progress</h3>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-success transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold flex items-center gap-2">
                <RiFileListLine className="size-5 text-primary" />
                Action Items
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
                    Upload Fight Tickets
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
                    Confirm Hotel Reservation
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
                    Issue Car Voucher
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
                    Finalize Guide Itinerary
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
                    Send Final Documents to Client
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
              Mark Booking Complete
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">Customer Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">Sarah Johnson</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">sarah.j@example.com</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 0123</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-bold">$2,520.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid via</span>
                <span className="font-medium">Credit Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">Feb 04, 2025</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs font-bold uppercase">
                  Paid in Full
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
