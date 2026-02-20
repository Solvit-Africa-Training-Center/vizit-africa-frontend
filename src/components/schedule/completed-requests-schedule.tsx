"use client";

import { RiCalendarLine, RiCheckLine, RiMapPinLine } from "@remixicon/react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { Booking } from "@/lib/schema/booking-schema";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface CompletedRequestsScheduleProps {
  bookings: Booking[];
  emptyMessage?: string;
}

interface ScheduleEntry {
  id: string;
  bookingId: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  quantity: number;
  amount: number;
  currency: string;
  location?: string;
}

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  try {
    const date = parseISO(value);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function formatDateRange(startDate: Date | null, endDate: Date | null): string {
  if (!startDate && !endDate) return "Flexible dates";
  if (startDate && !endDate) return format(startDate, "MMM d, yyyy");
  if (!startDate && endDate) return format(endDate, "MMM d, yyyy");
  if (startDate && endDate) {
    return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  }
  return "Flexible dates";
}

function getGroupingKey(startDate: Date | null): string {
  return startDate ? format(startDate, "yyyy-MM-dd") : "unscheduled";
}

function getGroupingLabel(startDate: Date | null): string {
  return startDate ? format(startDate, "EEEE, MMM d, yyyy") : "No fixed date";
}

export function CompletedRequestsSchedule({
  bookings,
  emptyMessage = "You don't have completed requests yet.",
}: CompletedRequestsScheduleProps) {
  const entries: ScheduleEntry[] = bookings.flatMap((booking) => {
    if (booking.items.length === 0) {
      return [
        {
          id: `booking-${booking.id}`,
          bookingId: booking.id,
          title: booking.tripPurpose || "Completed request",
          startDate: toDate(booking.arrivalDate) ?? toDate(booking.createdAt),
          endDate: toDate(booking.departureDate),
          quantity: booking.travelers,
          amount: booking.total_amount || 0,
          currency: booking.currency || "USD",
        },
      ];
    }

    return booking.items.map((item) => {
      const startDate = toDate(item.start_date);
      const endDate = toDate(item.end_date);
      const metadataLocation =
        item.metadata &&
        typeof item.metadata === "object" &&
        "location" in item.metadata &&
        typeof item.metadata.location === "string"
          ? item.metadata.location
          : undefined;

      return {
        id: `${booking.id}-${item.id}`,
        bookingId: booking.id,
        title: item.title || booking.tripPurpose || "Completed request item",
        startDate,
        endDate,
        quantity: item.quantity || booking.travelers || 1,
        amount: item.subtotal || item.unit_price || booking.total_amount || 0,
        currency:
          (item.metadata &&
          typeof item.metadata === "object" &&
          "currency" in item.metadata &&
          typeof item.metadata.currency === "string"
            ? item.metadata.currency
            : undefined) ||
          booking.currency ||
          "USD",
        location: metadataLocation,
      };
    });
  });

  const sortedEntries = [...entries].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.getTime() - b.startDate.getTime();
  });

  const groupedEntries = sortedEntries.reduce<
    Array<{ key: string; label: string; items: ScheduleEntry[] }>
  >((groups, entry) => {
    const key = getGroupingKey(entry.startDate);
    const existing = groups.find((group) => group.key === key);
    if (existing) {
      existing.items.push(entry);
      return groups;
    }

    groups.push({
      key,
      label: getGroupingLabel(entry.startDate),
      items: [entry],
    });
    return groups;
  }, []);

  if (bookings.length === 0) {
    return (
      <Empty className="rounded-sm p-20 border-dashed">
        <EmptyMedia variant="icon">
          <RiCalendarLine className="size-6" />
        </EmptyMedia>
        <EmptyTitle>No activity</EmptyTitle>
        <EmptyDescription>{emptyMessage}</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-sm border border-border p-4 bg-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Completed Requests
          </p>
          <p className="mt-2 text-2xl font-medium">{bookings.length}</p>
        </div>
        <div className="rounded-sm border border-border p-4 bg-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Scheduled Items
          </p>
          <p className="mt-2 text-2xl font-medium">{sortedEntries.length}</p>
        </div>
        <div className="rounded-sm border border-border p-4 bg-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Status
          </p>
          <Badge className="mt-2" variant="success-outline">
            <RiCheckLine className="size-3 mr-1" />
            Completed
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {groupedEntries.map((group) => (
          <section key={group.key} className="space-y-3">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
              {group.label}
            </h3>
            <div className="space-y-3">
              {group.items.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-sm border border-border bg-card p-4 md:p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-base">{entry.title}</h4>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <RiCalendarLine className="size-4" />
                        {formatDateRange(entry.startDate, entry.endDate)}
                      </div>
                      {entry.location ? (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <RiMapPinLine className="size-4" />
                          {entry.location}
                        </div>
                      ) : null}
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-muted-foreground">
                        {entry.quantity} unit(s)
                      </p>
                      <p className="font-medium">
                        {entry.currency} {entry.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/60">
                    <Link
                      className="text-sm text-primary hover:underline"
                      href={`/profile/bookings/${entry.bookingId}`}
                    >
                      View request details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
