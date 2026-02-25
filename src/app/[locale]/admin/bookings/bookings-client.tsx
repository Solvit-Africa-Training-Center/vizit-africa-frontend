"use client";

import { useState, useMemo } from "react";
import {
  RiCheckboxCircleLine,
  RiSearchLine,
  RiHistoryLine,
  RiBankCardLine,
  RiLayoutGridLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminBookingCard } from "@/components/admin/admin-booking-card";
import { type Booking } from "@/lib/unified-types";
import { cn } from "@/lib/utils";

interface BookingsClientProps {
  initialBookings: Booking[];
}

type BookingFilter = "all" | "paid" | "completed";

export default function BookingsClient({
  initialBookings,
}: BookingsClientProps) {
  const t = useTranslations("Admin.bookings");
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = useMemo(() => {
    return initialBookings.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(b.id).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        filter === "all" ||
        (filter === "paid" && b.status === "paid") ||
        (filter === "completed" && b.status === "completed");

      return matchesSearch && matchesTab;
    });
  }, [initialBookings, filter, searchQuery]);

  const stats = {
    all: initialBookings.length,
    paid: initialBookings.filter((b) => b.status === "paid").length,
    completed: initialBookings.filter((b) => b.status === "completed").length,
  };

  const tabs = [
    {
      id: "all",
      label: t("tabs.all"),
      icon: RiLayoutGridLine,
      count: stats.all,
    },
    { id: "paid", label: t("tabs.paid"), icon: RiBankCardLine, count: stats.paid },
    {
      id: "completed",
      label: t("tabs.completed"),
      icon: RiHistoryLine,
      count: stats.completed,
    },
  ];

  return (
    <div className="mx-auto max-w-9xl px-5 md:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>

        <div className="relative w-full md:w-80">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-muted/30 border border-border/50 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as BookingFilter)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
              filter === tab.id
                ? "bg-card text-primary shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
            <span className="ml-1 opacity-40 font-mono">{tab.count}</span>
          </button>
        ))}
      </div>

      {filteredBookings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <AdminBookingCard
              key={booking.id}
              booking={booking}
              t={(key: string) => t(key)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/10 rounded-3xl border-2 border-dashed border-border/50">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <RiCheckboxCircleLine className="size-8 text-muted-foreground/40" />
          </div>
          <h3 className="font-medium text-foreground text-lg">
            {t("empty.title")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
            {t("empty.description")}
          </p>
          {searchQuery && (
            <Button
              variant="link"
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              {t("empty.clearSearch")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
