"use client";

import { RiCalendarLine, RiCheckLine, RiMapPinLine } from "@remixicon/react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
} from "date-fns";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { bookingSchema, type Booking } from "@/lib/unified-types";

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

interface DayBucket {
  key: string;
  date: Date;
  items: ScheduleEntry[];
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

function getGroupingLabel(startDate: Date | null): string {
  return startDate ? format(startDate, "EEEE, MMM d, yyyy") : "No fixed date";
}

function expandCoverageDays(
  startDate: Date | null,
  endDate: Date | null,
): Date[] {
  if (!startDate && !endDate) return [];
  const intervalStart = startDate ?? endDate;
  const intervalEnd = endDate ?? startDate;
  if (!intervalStart || !intervalEnd) return [];

  const start = isAfter(intervalStart, intervalEnd)
    ? intervalEnd
    : intervalStart;
  const end = isAfter(intervalStart, intervalEnd) ? intervalStart : intervalEnd;
  return eachDayOfInterval({ start, end });
}

export function CompletedRequestsSchedule({
  bookings,
  emptyMessage = "You don't have completed requests yet.",
}: CompletedRequestsScheduleProps) {
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  );
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    startOfMonth(new Date()),
  );

  const entries: ScheduleEntry[] = completedBookings.flatMap((booking) => {
    if (booking.items.length === 0) {
      return [
        {
          id: `booking-${booking.id}`,
          bookingId: String(booking.id),
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
        bookingId: String(booking.id),
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

  const { coveredDates, monthBuckets, unscheduledEntries } = useMemo(() => {
    const allCoveredDateMap = new Map<string, Date>();
    const monthBucketMap = new Map<string, ScheduleEntry[]>();
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);
    const unscheduled: ScheduleEntry[] = [];

    const sortedEntries = [...entries].sort((a, b) => {
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return a.startDate.getTime() - b.startDate.getTime();
    });

    for (const entry of sortedEntries) {
      const coverageDays = expandCoverageDays(entry.startDate, entry.endDate);
      if (coverageDays.length === 0) {
        unscheduled.push(entry);
        continue;
      }

      for (const day of coverageDays) {
        const key = format(day, "yyyy-MM-dd");
        allCoveredDateMap.set(key, day);

        if (isBefore(day, monthStart) || isAfter(day, monthEnd)) {
          continue;
        }

        const existing = monthBucketMap.get(key);
        if (existing) {
          existing.push(entry);
        } else {
          monthBucketMap.set(key, [entry]);
        }
      }
    }

    const buckets: DayBucket[] = [...monthBucketMap.entries()]
      .map(([key, items]) => ({
        key,
        date: parseISO(key),
        items,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      coveredDates: [...allCoveredDateMap.values()],
      monthBuckets: buckets,
      unscheduledEntries: unscheduled,
    };
  }, [entries, visibleMonth]);

  if (completedBookings.length === 0) {
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
          <p className="mt-2 text-2xl font-medium">
            {completedBookings.length}
          </p>
        </div>
        <div className="rounded-sm border border-border p-4 bg-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Calendar Days Covered
          </p>
          <p className="mt-2 text-2xl font-medium">{coveredDates.length}</p>
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px),1fr]">
        <section className="rounded-sm border border-border bg-card p-4">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Covered Dates Calendar (Read-only)
          </h3>
          <Calendar
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            showOutsideDays
            className="w-full p-0"
            modifiers={{ covered: coveredDates }}
            modifiersClassNames={{
              covered:
                "bg-primary/15 text-primary font-semibold rounded-(--cell-radius)",
            }}
          />
        </section>

        <section className="rounded-sm border border-border bg-card p-4">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Dates Covered in {format(visibleMonth, "MMMM yyyy")}
          </h3>
          {monthBuckets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No completed request coverage in this month.
            </p>
          ) : (
            <div className="space-y-4">
              {monthBuckets.map((bucket) => (
                <article
                  key={bucket.key}
                  className="rounded-sm border border-border p-4"
                >
                  <p className="text-sm font-medium mb-3">
                    {getGroupingLabel(bucket.date)}
                  </p>
                  <div className="space-y-3">
                    {bucket.items.map((entry) => (
                      <div
                        key={`${bucket.key}-${entry.id}`}
                        className="rounded-sm bg-muted/40 border border-border/70 p-3"
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium text-sm">
                              {entry.title}
                            </h4>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <RiCalendarLine className="size-3.5" />
                              {formatDateRange(entry.startDate, entry.endDate)}
                            </div>
                            {entry.location ? (
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <RiMapPinLine className="size-3.5" />
                                {entry.location}
                              </div>
                            ) : null}
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-xs text-muted-foreground">
                              {entry.quantity} unit(s)
                            </p>
                            <p className="text-sm font-medium">
                              {entry.currency} {entry.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {unscheduledEntries.length > 0 ? (
        <section className="rounded-sm border border-border bg-card p-4">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Completed Requests Without Fixed Dates
          </h3>
          <div className="space-y-2">
            {unscheduledEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-sm border border-border/70 bg-muted/40 p-3"
              >
                <p className="font-medium text-sm">{entry.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {entry.quantity} unit(s) • {entry.currency}{" "}
                  {entry.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
