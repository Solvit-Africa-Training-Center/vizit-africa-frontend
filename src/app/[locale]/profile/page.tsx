"use client";

import {
  RiBookmarkLine,
  RiCalendarLine,
  RiInformationLine,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiPlaneLine,
  RiSettings3Line,
  RiSuitcaseLine,
} from "@remixicon/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInDays, isPast, parseISO } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  acceptQuoteForBooking,
  cancelBooking,
  getUserBookings,
} from "@/actions/bookings";
import { Footer } from "@/components/landing";
import { CompletedRequestsSchedule } from "@/components/schedule";
import { Navbar } from "@/components/shared";
import { PaymentModal } from "@/components/shared/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/components/user-provider";
import { Link } from "@/i18n/navigation";
import { type Booking } from "@/lib/unified-types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/quote-calculator";

type Tab = "overview" | "trips" | "saved" | "settings";
type Translator = (key: string) => string;

function SavedItemsTab({ t }: { t: Translator }) {
  return (
    <div className="text-center py-20 border border-dashed rounded-sm">
      <RiBookmarkLine className="size-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{t("saved.emptyTitle")}</p>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { user } = useUser();
  const t = useTranslations("Profile");
  const queryClient = useQueryClient();

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const result = await getUserBookings();
      if (result.success) return result.data;
      return [];
    },
  });
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingBooking, setPayingBooking] = useState<{
    id: string;
    amount: number;
    currency: string;
    email: string;
    name: string;
  } | null>(null);

  const stats = useMemo(() => {
    if (!bookingsData) return { trips: 0, days: 0 };

    const confirmedTrips = (bookingsData || []).filter(
      (b: Booking) => b.status === "confirmed",
    );
    const trips = confirmedTrips.length;

    let days = 0;
    confirmedTrips.forEach((b: Booking) => {
      const hasStarted = b.items.some((item) => {
        if (!item.start_date) return false;
        try {
          return isPast(parseISO(item.start_date));
        } catch {
          return false;
        }
      });

      if (hasStarted) {
        b.items.forEach((item) => {
          if (!item.start_date || !item.end_date) return;
          try {
            days +=
              differenceInDays(
                parseISO(item.end_date),
                parseISO(item.start_date),
              ) + 1;
          } catch {
            // ignore date parse errors
          }
        });
      }
    });
    return { trips, days };
  }, [bookingsData]);

  const nextTrip = useMemo(() => {
    if (!bookingsData) return null;

    const confirmed = bookingsData
      .filter((b: Booking) => b.status === "confirmed" && b.items.length > 0)
      .sort((a: Booking, b: Booking) => {
        const startA = a.items[0]?.start_date;
        const startB = b.items[0]?.start_date;
        if (!startA || !startB) return 0;
        return new Date(startA).getTime() - new Date(startB).getTime();
      })[0];

    if (confirmed) return confirmed;

    const pending = bookingsData
      .filter((b: Booking) => b.status === "pending" && b.items.length > 0)
      .sort((a: Booking, b: Booking) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })[0];

    return pending;
  }, [bookingsData]);

  const pendingRequests = useMemo(() => {
    if (!bookingsData) return [];
    return bookingsData.filter(
      (b: Booking) =>
        b.status === "pending" ||
        b.status === "quoted" ||
        b.quote?.status === "quoted",
    );
  }, [bookingsData]);

  const completedRequests = useMemo(() => {
    if (!bookingsData) return [];
    return bookingsData.filter((b: Booking) => b.status === "completed");
  }, [bookingsData]);

  const tabs = [
    { id: "overview", label: t("tabs.overview"), icon: RiMapPinLine },
    { id: "trips", label: t("tabs.trips"), icon: RiSuitcaseLine },
    { id: "saved", label: t("tabs.saved"), icon: RiBookmarkLine },
    { id: "settings", label: t("tabs.settings"), icon: RiSettings3Line },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                {t("header.title")}
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-medium text-foreground">
                {user.full_name}'s Profile
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <RiLogoutBoxRLine className="size-4" />
                {t("header.signOut")}
              </Button>
            </div>
          </header>

          <div className="flex items-center gap-8 border-b border-border/50 mb-12 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex items-center gap-2 pb-4 text-sm font-medium uppercase tracking-widest transition-all relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && (
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="group relative aspect-4/5 md:aspect-video lg:aspect-square overflow-hidden rounded-sm bg-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2600&auto=format&fit=crop"
                      alt={t("overview.nextTrip.imageAlt")}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between text-primary-foreground">
                      <div className="flex justify-between items-start">
                        <span className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full text-primary-foreground">
                          {t("overview.nextTrip.label")}
                        </span>
                        {nextTrip ? (
                          <div className="text-right">
                            <p className="text-3xl font-display font-medium">
                              {nextTrip.items[0]?.start_date
                                ? differenceInDays(
                                    new Date(nextTrip.items[0].start_date),
                                    new Date(),
                                  )
                                : "-"}
                            </p>
                            <p className="text-xs font-mono uppercase opacity-80">
                              {t("overview.nextTrip.daysLeft")}
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="font-display text-4xl md:text-5xl font-medium text-primary-foreground mb-2">
                          {nextTrip
                            ? nextTrip.status === "confirmed"
                              ? "Upcoming Adventure"
                              : "Request Processing"
                            : "No Trips Planned"}
                        </h2>
                        {nextTrip?.items[0]?.start_date && (
                          <p className="text-lg font-light opacity-90 flex items-center gap-2">
                            <RiCalendarLine className="size-5" />
                            {new Date(
                              nextTrip.items[0].start_date,
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {nextTrip.items[0].end_date
                              ? new Date(
                                  nextTrip.items[0].end_date,
                                ).toLocaleDateString()
                              : ""}
                          </p>
                        )}

                        <div className="mt-8 pt-8 border-t border-primary-foreground/10 grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-xs font-mono uppercase opacity-70 mb-1">
                              {t("overview.nextTrip.status")}
                            </p>
                            <p className="font-medium">
                              {nextTrip
                                ? nextTrip.status === "confirmed"
                                  ? t("overview.nextTrip.confirmed")
                                  : "In Review"
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-mono uppercase opacity-70 mb-1">
                              {t("overview.nextTrip.travelers")}
                            </p>
                            <p className="font-medium">
                              {nextTrip
                                ? `${nextTrip.items[0]?.quantity || 0} Unit(s)`
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <h3 className="font-display text-2xl font-medium mb-2">
                        {t("overview.pendingRequests.title")}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-6">
                        Our experts are manually sourcing the best flight and
                        service options for your requests. Final quotes are
                        provided within 48 hours.
                      </p>
                      <div className="space-y-4">
                        {isLoading ? (
                          <p>Loading requests...</p>
                        ) : pendingRequests.length > 0 ? (
                          pendingRequests.map((req: Booking) => (
                            <div
                              key={req.id}
                              className="border border-border p-6 rounded-sm hover:border-primary transition-colors group bg-card"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
                                    <Link href={`/profile/bookings/${req.id}`}>
                                      Trip Request #
                                      {req.id.toString().slice(0, 8)}
                                    </Link>
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      req.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className="text-xs font-medium uppercase tracking-wider border border-border px-2 py-1 rounded-full text-muted-foreground">
                                  {req.quote?.status === "quoted"
                                    ? "quoted"
                                    : req.status}
                                </span>
                              </div>

                              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                                <div>
                                  <span className="block text-xs uppercase opacity-70">
                                    Created
                                  </span>
                                  {new Date(req.createdAt).toLocaleDateString()}
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
                                    {new Date(
                                      req.items[0].start_date,
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                              </div>

                              {req.quote?.status === "quoted" && (
                                <div className="mb-3 flex items-center justify-between gap-3 bg-muted/30 p-3 rounded-md border border-border/50">
                                  <p className="text-sm font-medium text-primary">
                                    Quote Ready:{" "}
                                    <span className="text-lg">
                                      {formatCurrency(
                                        req.quote.totalAmount,
                                        req.quote.currency || "USD",
                                      )}
                                    </span>
                                  </p>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setPayingBooking({
                                        id: String(req.id),
                                        amount: req.quote?.totalAmount || 0,
                                        currency: req.quote?.currency || "USD",
                                        email: req.email || "",
                                        name: req.name || "Traveler",
                                      });
                                    }}
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
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </Link>

                                {(req.status === "pending" ||
                                  req.status === "quoted") && (
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
                                      const result = await cancelBooking(
                                        String(req.id),
                                      );
                                      setCancellingId(null);

                                      if (result.success) {
                                        toast.success(
                                          "Booking request cancelled successfully.",
                                        );
                                        window.location.reload();
                                      } else {
                                        toast.error(
                                          result.error ||
                                            "Failed to cancel booking",
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
                              No pending requests
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
              )}

              {activeTab === "trips" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-3xl font-medium">
                      {t("trips.title")}
                    </h2>
                    <Button>
                      <RiPlaneLine className="size-4 mr-2" />
                      {t("trips.planNew")}
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="py-20 text-center border border-dashed rounded-sm">
                      <p className="text-muted-foreground">Loading trips...</p>
                    </div>
                  ) : (
                    <CompletedRequestsSchedule
                      bookings={completedRequests}
                      emptyMessage="You don't have completed requests yet."
                    />
                  )}
                </div>
              )}

              {activeTab === "saved" && <SavedItemsTab t={t} />}

              {activeTab === "settings" && (
                <div className="max-w-2xl">
                  <h2 className="font-display text-3xl font-medium mb-8">
                    {t("settings.title")}
                  </h2>
                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        {t("settings.fullName")}
                      </Label>
                      <div className="border-b border-border py-2 text-lg">
                        {user.full_name}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        {t("settings.email")}
                      </Label>
                      <div className="border-b border-border py-2 text-lg">
                        {user.email}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Phone Number
                      </Label>
                      <div className="border-b border-border py-2 text-lg">
                        {user.phone_number || "-"}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Bio
                      </Label>
                      <div className="border-b border-border py-2 text-lg">
                        {user.bio || "Travel enthusiast"}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Preferred Currency
                      </Label>
                      <div className="border-b border-border py-2 text-lg">
                        {user.preferred_currency || "USD"}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Role
                      </Label>
                      <div className="border-b border-border py-2 text-lg flex items-center gap-2">
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button>{t("settings.save")}</Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      {payingBooking && (
        <PaymentModal
          isOpen={!!payingBooking}
          onClose={() => setPayingBooking(null)}
          amount={payingBooking.amount}
          currency={payingBooking.currency}
          bookingId={payingBooking.id}
          clientEmail={payingBooking.email}
          travelerName={payingBooking.name}
          onPaymentSuccess={async () => {
            setAcceptingId(payingBooking.id);
            const result = await acceptQuoteForBooking(payingBooking.id);
            if (result.success) {
              toast.success("Payment received! Your booking is now confirmed.");
              queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
            } else {
              toast.error(
                result.error || "Payment processed but confirmation failed.",
              );
            }
            setAcceptingId(null);
            setPayingBooking(null);
          }}
        />
      )}
    </>
  );
}
