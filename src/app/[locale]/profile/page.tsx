"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";
import {
  RiMapPinLine,
  RiCalendarLine,
  RiSettings3Line,
  RiBookmarkLine,
  RiSuitcaseLine,
  RiLogoutBoxRLine,
  RiPlaneLine,
  RiInformationLine,
} from "@remixicon/react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { useUser } from "@/components/user-provider";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getUserBookings, acceptQuoteForBooking } from "@/actions/bookings";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

type Tab = "overview" | "trips" | "saved" | "settings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { user } = useUser();
  const t = useTranslations("Profile");
  const tCommon = useTranslations("Admin.requests.table.badges");

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const result = await getUserBookings();
      if (result.success) return result.data;
      return [];
    },
  });
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!bookingsData) return { trips: 0, days: 0 };
    const trips = bookingsData.filter(b => b.status === "confirmed").length;
    let days = 0;
    bookingsData.forEach(b => {
      b.items.forEach(item => {
        days += differenceInDays(new Date(item.end_date), new Date(item.start_date)) + 1;
      });
    });
    return { trips, days };
  }, [bookingsData]);

  const nextTrip = useMemo(() => {
    if (!bookingsData) return null;

    // 1. Try to find the next confirmed trip
    const confirmed = bookingsData
      .filter(b => b.status === "confirmed" && b.items.length > 0)
      .sort((a, b) => new Date(a.items[0].start_date).getTime() - new Date(b.items[0].start_date).getTime())[0];

    if (confirmed) return confirmed;

    // 2. Fallback to the latest pending request
    const pending = bookingsData
      .filter(b => b.status === "pending" && b.items.length > 0)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    return pending;
  }, [bookingsData]);

  const pendingRequests = useMemo(() => {
    if (!bookingsData) return [];
    return bookingsData.filter(
      (b) => b.status === "pending" || b.status === "quoted" || b.quote?.status === "quoted",
    );
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
                              {differenceInDays(new Date(nextTrip.items[0].start_date), new Date())}
                            </p>
                            <p className="text-xs font-mono uppercase opacity-80">
                              {t("overview.nextTrip.daysLeft")}
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="font-display text-4xl md:text-5xl font-medium text-primary-foreground mb-2">
                          {nextTrip ? (nextTrip.status === 'confirmed' ? "Upcoming Adventure" : "Request Processing") : "No Trips Planned"}
                        </h2>
                        {nextTrip && (
                          <p className="text-lg font-light opacity-90 flex items-center gap-2">
                            <RiCalendarLine className="size-5" />
                            {new Date(nextTrip.items[0].start_date).toLocaleDateString()} - {new Date(nextTrip.items[0].end_date).toLocaleDateString()}
                          </p>
                        )}

                        <div className="mt-8 pt-8 border-t border-primary-foreground/10 grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-xs font-mono uppercase opacity-70 mb-1">
                              {t("overview.nextTrip.status")}
                            </p>
                            <p className="font-medium">
                              {nextTrip ? (nextTrip.status === 'confirmed' ? t("overview.nextTrip.confirmed") : "In Review") : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-mono uppercase opacity-70 mb-1">
                              {t("overview.nextTrip.travelers")}
                            </p>
                            <p className="font-medium">
                              {nextTrip ? `${nextTrip.items[0].quantity} Unit(s)` : "-"}
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
                          pendingRequests.map((req) => (
                            <div
                              key={req.id}
                              className="border border-border p-6 rounded-sm hover:border-primary transition-colors group bg-card"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-medium text-lg mb-1">
                                    Trip Request #{req.id.toString().slice(0, 8)}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(req.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className="text-xs font-medium uppercase tracking-wider border border-border px-2 py-1 rounded-full text-muted-foreground">
                                  {req.quote?.status === "quoted" ? "quoted" : req.status}
                                </span>
                              </div>
                              {req.quote?.status === "quoted" && (
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <p className="text-sm text-primary">
                                    Quote ready: {req.quote.total_amount} {req.quote.currency || "USD"}
                                  </p>
                                  <Button
                                    size="sm"
                                    onClick={async () => {
                                      setAcceptingId(String(req.id));
                                      const result = await acceptQuoteForBooking(String(req.id));
                                      setAcceptingId(null);
                                      if (result.success) {
                                        toast.success("Quote accepted. Your trip is now confirmed.");
                                        window.location.reload();
                                      } else {
                                        toast.error(result.error || "Failed to accept quote");
                                      }
                                    }}
                                    disabled={acceptingId === String(req.id)}
                                  >
                                    {acceptingId === String(req.id) ? "Accepting..." : "Accept Quote"}
                                  </Button>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {(req.quote?.items || req.items).map((item, idx) => {
                                  const itemType =
                                    "type" in item
                                      ? item.type
                                      : "status" in item
                                        ? item.status
                                        : "service";
                                  return (
                                  <span key={idx} className="text-xs border border-border px-2 py-1 uppercase tracking-wider text-muted-foreground">
                                    {itemType || "service"} Item
                                  </span>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 border border-dashed rounded-sm">
                            <RiInformationLine className="size-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No pending requests</p>
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
                  <div className="border-y border-border divide-y divide-border">
                    {bookingsData?.filter(b => b.status === "confirmed").map((trip) => (
                      <div key={trip.id} className="py-8 grid md:grid-cols-4 gap-6 items-center group">
                        <div className="md:col-span-2">
                          <h3 className="font-display text-2xl font-medium mb-2 group-hover:text-primary transition-colors">
                            {trip.items[0]?.service || "Safari Experience"}
                          </h3>
                          <p className="text-muted-foreground">
                            {new Date(trip.items[0]?.start_date).toLocaleDateString()} - {new Date(trip.items[0]?.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="success-outline">Confirmed</Badge>
                        <div className="text-right">
                          <Button variant="outline">
                            {t("trips.viewDetails")}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!bookingsData || bookingsData.filter(b => b.status === "confirmed").length === 0) && (
                      <div className="py-20 text-center">
                        <p className="text-muted-foreground">You don't have any confirmed trips yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <Empty>
                  <EmptyMedia>
                    <RiBookmarkLine className="size-8" />
                  </EmptyMedia>
                  <EmptyTitle>{t("saved.emptyTitle")}</EmptyTitle>
                  <EmptyDescription>{t("saved.emptyDescription")}</EmptyDescription>
                </Empty>
              )}

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
    </>
  );
}
