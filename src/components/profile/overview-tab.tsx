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
      <div className="group relative aspect-4/5 md:aspect-video lg:aspect-square overflow-hidden rounded-[2.5rem] bg-surface-ink border border-primary/10 shadow-2xl isolate">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2600&auto=format&fit=crop"
          alt={t("overview.nextTrip.imageAlt")}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,oklch(65%_0.06_245/0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10" />

        <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <Badge className="bg-primary-light/10 text-primary-light border border-primary-light/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
              {t("overview.nextTrip.label")}
            </Badge>
            {nextTrip ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-24">
                <p className="text-4xl font-display font-bold leading-none text-primary-light">
                  {nextTrip.items[0]?.startDate
                    ? differenceInDays(
                        new Date(nextTrip.items[0].startDate),
                        new Date(),
                      )
                    : "-"}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-70 text-white/80">
                  {t("overview.nextTrip.daysLeft")}
                </p>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-display text-4xl md:text-6xl font-medium text-white mb-3 leading-tight text-pretty">
                {nextTrip
                  ? nextTrip.status === "paid" ||
                    nextTrip.status === "confirmed"
                    ? t("overview.nextTrip.confirmed")
                    : t("overview.nextTrip.preparing")
                  : t("overview.nextTrip.start")}
              </h2>
              {nextTrip?.items[0]?.startDate && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm text-sm font-light border border-white/10 text-white/90">
                  <RiCalendarLine className="size-4 text-primary-light" />
                  <span>
                    {format(parseISO(nextTrip.items[0].startDate), "MMM d")} -{" "}
                    {nextTrip.items[0].endDate
                      ? format(
                          parseISO(nextTrip.items[0].endDate),
                          "MMM d, yyyy",
                        )
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
                  <span
                    className={`inline-block size-2 rounded-full ${nextTrip?.status === "paid" ? "bg-emerald-400" : "bg-primary animate-pulse"}`}
                  />
                  {nextTrip
                    ? nextTrip.status === "paid" ||
                      nextTrip.status === "confirmed"
                      ? t("overview.nextTrip.paid")
                      : t("overview.nextTrip.refining")
                    : t("overview.nextTrip.dreaming")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                  {t("overview.nextTrip.travelers")}
                </p>
                <p className="font-medium tracking-tight">
                  {nextTrip
                    ? t("overview.nextTrip.adventurers", {
                        count: nextTrip.travelers || 0,
                      })
                    : t("overview.nextTrip.joinUs")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div>
          <h3 className="font-display text-2xl font-medium mb-2 uppercase tracking-tight">
            {t("overview.tripsAndRequests.title")}
          </h3>
          <p className="text-xs text-muted-foreground mb-6 font-light">
            {t("overview.tripsAndRequests.description")}
          </p>
          <div className="space-y-4">
            {isLoading ? (
              <p>{t("overview.tripsAndRequests.loading")}</p>
            ) : pendingRequests.length > 0 ? (
              pendingRequests.map((req: Booking) => (
                <div
                  key={req.id}
                  className={`border p-6 rounded-2xl transition-all duration-500 group bg-card shadow-sm ${req.status === "paid" ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-border/50 hover:border-primary/30 shadow-card"}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-display text-lg font-medium mb-1 hover:text-primary transition-colors uppercase tracking-tight">
                        <Link href={`/profile/bookings/${req.id}`}>
                          {req.status === "paid"
                            ? t("overview.tripsAndRequests.tripId", {
                                id: req.id.toString().slice(0, 8),
                              })
                            : t("overview.tripsAndRequests.requestId", {
                                id: req.id.toString().slice(0, 8),
                              })}
                        </Link>
                      </h4>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest border px-3 py-1 rounded-full ${
                        req.status === "paid"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : req.status === "accepted"
                            ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                            : req.status === "quoted"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "border-border text-muted-foreground"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                        {req.status === "paid"
                          ? t("overview.tripsAndRequests.status")
                          : t("overview.tripsAndRequests.created")}
                      </span>
                      <span className="font-medium">
                        {req.status === "paid"
                          ? t("overview.nextTrip.paid")
                          : new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                        {t("overview.tripsAndRequests.items")}
                      </span>
                      <span className="font-medium">
                        {t("overview.tripsAndRequests.itemsCount", {
                          count: req.items.length,
                        })}
                      </span>
                    </div>
                    {req.items[0]?.startDate && (
                      <div className="col-span-2">
                        <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                          {t("overview.tripsAndRequests.startDate")}
                        </span>
                        <span className="font-medium">
                          {new Date(req.items[0].startDate).toLocaleDateString(
                            undefined,
                            { dateStyle: "long" },
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {req.status === "quoted" && (
                    <div className="mb-6 flex items-center justify-between gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        {t("overview.tripsAndRequests.quoteReady", {
                          amount: formatCurrency(
                            req.totalAmount || 0,
                            req.currency || "USD",
                          ),
                        })}
                      </p>
                      <Button
                        size="sm"
                        className="h-10 rounded-lg font-display uppercase tracking-widest text-[10px] font-bold"
                        onClick={() => onPay(req)}
                        disabled={
                          acceptingId === String(req.id) ||
                          cancellingId === String(req.id)
                        }
                      >
                        {t("overview.tripsAndRequests.acceptPay")}
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <Link href={`/profile/bookings/${req.id}`}>
                      <Button
                        variant={req.status === "paid" ? "default" : "outline"}
                        size="sm"
                        className="h-10 rounded-lg font-display uppercase tracking-widest text-[10px] font-bold"
                      >
                        {req.status === "paid"
                          ? t("overview.tripsAndRequests.manageTrip")
                          : t("overview.tripsAndRequests.viewDetails")}
                      </Button>
                    </Link>

                    {(req.status === "pending" || req.status === "quoted") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 rounded-lg font-display uppercase tracking-widest text-[10px] font-bold"
                        disabled={
                          cancellingId === String(req.id) ||
                          acceptingId === String(req.id)
                        }
                        onClick={async () => {
                          if (
                            !confirm(
                              t("overview.tripsAndRequests.cancelConfirm"),
                            )
                          )
                            return;

                          setCancellingId(String(req.id));
                          const result = await cancelBooking(String(req.id));
                          setCancellingId(null);

                          if (result.success) {
                            toast.success(t("messages.cancelSuccess"));
                            window.location.reload();
                          } else {
                            toast.error(
                              result.error || t("messages.cancelError"),
                            );
                          }
                        }}
                      >
                        {cancellingId === String(req.id) ? (
                          <Spinner className="size-4 mr-2" />
                        ) : (
                          <RiInformationLine className="size-4 mr-2" />
                        )}
                        {t("overview.tripsAndRequests.cancelRequest")}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-[2rem] bg-muted/10 border-border/50">
                <RiInformationLine className="size-10 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground font-light italic">
                  {t("overview.tripsAndRequests.noTrips")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border/50 pt-12">
          <h3 className="font-display text-2xl font-medium mb-6 uppercase tracking-tight">
            {t("overview.stats.title")}
          </h3>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-display font-medium text-primary">
                {stats.trips < 10 ? `0${stats.trips}` : stats.trips}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                {t("overview.stats.trips")}
              </p>
            </div>
            <div>
              <p className="text-4xl font-display font-medium text-primary">
                {stats.days < 10 ? `0${stats.days}` : stats.days}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                {t("overview.stats.days")}
              </p>
            </div>
            <div>
              <p className="text-4xl font-display font-medium text-primary">
                00
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                {t("overview.stats.reviews")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
