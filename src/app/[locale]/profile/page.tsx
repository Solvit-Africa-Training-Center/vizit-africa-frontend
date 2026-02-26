"use client";

import {
  RiBookmarkLine,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiSettings3Line,
  RiSuitcaseLine,
} from "@remixicon/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInDays, isPast, parseISO } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { acceptQuoteForBooking, getUserBookings } from "@/actions/bookings";
import { Footer } from "@/components/landing/footer";
import { OverviewTab } from "@/components/profile/overview-tab";
import { SavedItemsTab } from "@/components/profile/saved-items-tab";
import { SettingsTab } from "@/components/profile/settings-tab";
import { TripsTab } from "@/components/profile/trips-tab";
import { Navbar } from "@/components/shared/navbar";
import { PaymentModal } from "@/components/shared/payment";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/user-provider";
import { type Booking } from "@/lib/unified-types";
import { cn } from "@/lib/utils";

type Tab = "overview" | "trips" | "saved" | "settings";

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
  const [payingBooking, setPayingBooking] = useState<{
    id: string;
    amount: number;
    currency: string;
    email: string;
    name: string;
  } | null>(null);
  console.log({ bookingsData });
  const stats = useMemo(() => {
    if (!bookingsData) return { trips: 0, days: 0 };

    const confirmedTrips = (bookingsData || []).filter(
      (b: Booking) => b.status === "paid" || b.status === "completed",
    );
    const trips = confirmedTrips.length;

    let days = 0;
    confirmedTrips.forEach((b: Booking) => {
      const hasStarted = b.items.some((item) => {
        if (!item.startDate) return false;
        try {
          return isPast(parseISO(item.startDate));
        } catch {
          return false;
        }
      });

      if (hasStarted) {
        b.items.forEach((item) => {
          if (!item.startDate || !item.endDate) return;
          try {
            days +=
              differenceInDays(
                parseISO(item.endDate),
                parseISO(item.startDate),
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

    const paid = bookingsData
      .filter((b: Booking) => b.status === "paid" && b.items.length > 0)
      .sort((a: Booking, b: Booking) => {
        const startA = a.items[0]?.startDate;
        const startB = b.items[0]?.startDate;
        if (!startA || !startB) return 0;
        return new Date(startA).getTime() - new Date(startB).getTime();
      })[0];

    if (paid) return paid;

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
        b.status === "accepted" ||
        b.status === "paid",
    );
  }, [bookingsData]);

  const completedRequests = useMemo(() => {
    if (!bookingsData) return [];
    return bookingsData.filter(
      (b: Booking) => b.status === "paid" || b.status === "completed",
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
        <p>{t("overview.loading")}</p>
      </div>
    );
  }

  const handlePay = (booking: Booking) => {
    setPayingBooking({
      id: String(booking.id),
      amount: booking.totalAmount || 0,
      currency: booking.currency || "USD",
      email: booking.email || "",
      name: booking.name || t("messages.fallbacks.name"),
    });
  };

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
                {t("header.subtitle", { name: user.fullName.split(" ")[0] })}
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
                <OverviewTab
                  nextTrip={nextTrip}
                  pendingRequests={pendingRequests}
                  isLoading={isLoading}
                  stats={stats}
                  onPay={handlePay}
                  acceptingId={acceptingId}
                />
              )}

              {activeTab === "trips" && (
                <TripsTab
                  completedRequests={completedRequests}
                  isLoading={isLoading}
                />
              )}

              {activeTab === "saved" && <SavedItemsTab t={(key) => t(key)} />}

              {activeTab === "settings" && <SettingsTab user={user} />}
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
              toast.success(t("messages.paymentSuccess"));
              queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
            } else {
              toast.error(
                result.error || t("messages.paymentConfirmationFailed"),
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
