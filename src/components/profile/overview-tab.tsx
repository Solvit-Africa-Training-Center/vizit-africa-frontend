"use client";

import { RiCalendarLine, RiInformationLine } from "@remixicon/react";
import { differenceInDays, format, parseISO } from "date-fns";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { cancelBooking } from "@/actions/bookings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@/i18n/navigation";
import { type Booking } from "@/lib/unified-types";
import { formatCurrency } from "@/lib/utils/quote-calculator";

interface OverviewTabProps {
  nextTrip: Booking | null;
  pendingRequests: Booking[];
  isLoading: boolean;
  stats: { trips: number; days: number };
  onPay: (booking: Booking) => void;
  acceptingId: string | null;
}

export function OverviewTab({
  nextTrip,
  pendingRequests,
  isLoading,
  stats,
  onPay,
  acceptingId,
}: OverviewTabProps) {
  const t = useTranslations("Profile");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <div className="group relative aspect-4/5 md:aspect-video lg:aspect-square overflow-hidden rounded-3xl bg-muted shadow-2xl shadow-black/20">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2600&auto=format&fit=crop"
          alt={t("overview.nextTrip.imageAlt")}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80" />

        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between text-primary-foreground">
          <div className="flex justify-between items-start">
            <Badge className="bg-primary border-none text-primary-foreground px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
              {t("overview.nextTrip.label")}
            </Badge>
            {nextTrip ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-24">
                <p className="text-4xl font-display font-bold leading-none">
                  {nextTrip.items[0]?.start_date
                    ? differenceInDays(
                        new Date(nextTrip.items[0].start_date),
                        new Date(),
                      )
                    : "-"}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-70">
                  {t("overview.nextTrip.daysLeft")}
                </p>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-display text-4xl md:text-6xl font-medium text-primary-foreground mb-3 leading-tight">
                {nextTrip
                  ? nextTrip.status === "paid" || nextTrip.status === "confirmed"
                    ? "Your African Journey Awaits"
                    : "Journey in Preparation"
                  : "Start Your Story"}
              </h2>
              {nextTrip?.items[0]?.start_date && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-light border border-white/10">
                  <RiCalendarLine className="size-4 text-primary" />
                  <span>
                    {format(parseISO(nextTrip.items[0].start_date), "MMM d")} -{" "}
                    {nextTrip.items[0].end_date
                      ? format(parseISO(nextTrip.items[0].end_date), "MMM d, yyyy")
                      : ""}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                  {t("overview.nextTrip.status")}
                </p>
                <p className="font-medium flex items-center gap-2">
                  <span className={`inline-block size-2 rounded-full ${nextTrip?.status === "paid" ? "bg-emerald-400" : "bg-primary animate-pulse"}`} />
                  {nextTrip
                    ? nextTrip.status === "paid" ||
                      nextTrip.status === "confirmed"
                      ? t("overview.nextTrip.paid")
                      : "Refining Itinerary"
                    : "Dreaming"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                  {t("overview.nextTrip.travelers")}
                </p>
                <p className="font-medium tracking-tight">
                  {nextTrip
                    ? `${nextTrip.travelers} Adventurers`
                    : "Join us"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div>
          <h3 className="font-display text-2xl font-medium mb-2">
            My Trips & Requests
          </h3>
          <p className="text-xs text-muted-foreground mb-6">
            Track your upcoming adventures and active planning requests in one place.
          </p>
          <div className="space-y-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : pendingRequests.length > 0 ? (
              pendingRequests.map((req: Booking) => (
                <div
                  key={req.id}
                  className={`border p-6 rounded-sm transition-colors group bg-card ${req.status === "paid" ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-border hover:border-primary"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
                        <Link href={`/profile/bookings/${req.id}`}>
                          {req.status === "paid" ? "Trip #" : "Trip Request #"}
                          {req.id.toString().slice(0, 8)}
                        </Link>
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium uppercase tracking-wider border px-2 py-1 rounded-full ${
                        req.status === "paid"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : req.status === "accepted"
                            ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                            : "border-border text-muted-foreground"
                      }`}
                    >
                      {req.quote?.status === "quoted" && req.status !== "paid"
                        ? "quoted"
                        : req.status}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="block text-xs uppercase opacity-70">
                        {req.status === "paid" ? "Status" : "Created"}
                      </span>
                      {req.status === "paid"
                        ? "Confirmed"
                        : new Date(req.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="block text-xs uppercase opacity-70">
                        Items
                      </span>
                      {req.items.length} items
                    </div>
                    {req.items[0]?.start_date && (
                      <div>
                        <span className="block text-xs uppercase opacity-70">
                          Start Date
                        </span>
                        {new Date(req.items[0].start_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {req.quote?.status === "quoted" && req.status !== "paid" && (
                    <div className="mb-3 flex items-center justify-between gap-3 bg-muted/30 p-3 rounded-md border border-border/50">
                      <p className="text-sm font-medium text-primary">
                        Quote Ready:{" "}
                        <span className="text-lg">
                          {formatCurrency(
                            req.quote.totalAmount || 0,
                            req.quote.currency || "USD",
                          )}
                        </span>
                      </p>
                      <Button
                        size="sm"
                        onClick={() => onPay(req)}
                        disabled={
                          acceptingId === String(req.id) ||
                          cancellingId === String(req.id)
                        }
                      >
                        Accept & Pay
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <Link href={`/profile/bookings/${req.id}`}>
                      <Button
                        variant={req.status === "paid" ? "default" : "outline"}
                        size="sm"
                      >
                        {req.status === "paid" ? "Manage Trip" : "View Details"}
                      </Button>
                    </Link>

                    {(req.status === "pending" || req.status === "quoted") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={
                          cancellingId === String(req.id) ||
                          acceptingId === String(req.id)
                        }
                        onClick={async () => {
                          if (
                            !confirm(
                              "Are you sure you want to cancel this request? This action cannot be undone.",
                            )
                          )
                            return;

                          setCancellingId(String(req.id));
                          const result = await cancelBooking(String(req.id));
                          setCancellingId(null);

                          if (result.success) {
                            toast.success(
                              "Booking request cancelled successfully.",
                            );
                            window.location.reload();
                          } else {
                            toast.error(
                              result.error || "Failed to cancel booking",
                            );
                          }
                        }}
                      >
                        {cancellingId === String(req.id) ? (
                          <Spinner className="size-4 mr-2" />
                        ) : (
                          <RiInformationLine className="size-4 mr-2" />
                        )}
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed rounded-sm">
                <RiInformationLine className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No active trips or requests
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-12">
          <h3 className="font-display text-2xl font-medium mb-6">
            {t("overview.stats.title")}
          </h3>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-display font-light text-primary">
                {stats.trips < 10 ? `0${stats.trips}` : stats.trips}
              </p>
              <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                {t("overview.stats.trips")}
              </p>
            </div>
            <div>
              <p className="text-4xl font-display font-light text-primary">
                {stats.days < 10 ? `0${stats.days}` : stats.days}
              </p>
              <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                {t("overview.stats.days")}
              </p>
            </div>
            <div>
              <p className="text-4xl font-display font-light text-primary">
                00
              </p>
              <p className="text-xs font-mono uppercase text-muted-foreground mt-2">
                {t("overview.stats.reviews")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
