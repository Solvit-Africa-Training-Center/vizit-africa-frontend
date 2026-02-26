"use client";

import {
  RiCalendar2Line,
  RiMapPin2Line,
  RiPlaneLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiPushpinLine,
} from "@remixicon/react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { type Booking, type BookingItem } from "@/lib/unified-types";
import { normalizeServiceType } from "@/lib/utils";

interface TripTimelineProps {
  booking: Booking;
}

export function TripTimeline({ booking }: TripTimelineProps) {
  // Sort items by date
  const sortedItems = [...booking.items].sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // Group items by date
  const itemsByDate: Record<string, BookingItem[]> = {};
  sortedItems.forEach((item) => {
    if (!item.startDate) return;
    const dateKey = format(parseISO(item.startDate), "yyyy-MM-dd");
    if (!itemsByDate[dateKey]) itemsByDate[dateKey] = [];
    itemsByDate[dateKey].push(item);
  });

  const dates = Object.keys(itemsByDate).sort();

  const getIcon = (type: string) => {
    const normalized = normalizeServiceType(type);
    switch (normalized) {
      case "flight":
        return RiPlaneLine;
      case "hotel":
        return RiHotelLine;
      case "car":
        return RiCarLine;
      case "guide":
        return RiUserStarLine;
      default:
        return RiPushpinLine;
    }
  };

  return (
    <div className="relative space-y-12 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-linear-to-b before:from-primary/40 before:via-border before:to-transparent">
      {dates.length === 0 ? (
        <div className="pl-12 py-8 italic text-muted-foreground text-sm">
          Detailed itinerary being finalized...
        </div>
      ) : (
        dates.map((date, idx) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-12"
          >
            {/* Timeline node */}
            <div className="absolute left-0 top-1 size-[35px] rounded-full border-2 border-background bg-card flex items-center justify-center shadow-sm z-10">
              <span className="text-[10px] font-bold text-primary">
                D{idx + 1}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h4 className="font-display text-lg font-medium">
                  {format(parseISO(date), "EEEE, MMM d")}
                </h4>
                <div className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
              </div>

              <div className="grid gap-3">
                {itemsByDate[date].map((item, itemIdx) => {
                  const Icon = getIcon(item.itemType || "other");
                  return (
                    <div
                      key={item.id || itemIdx}
                      className="group flex gap-4 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-card hover:border-primary/20 transition-all hover:shadow-md hover:shadow-primary/5"
                    >
                      <div className="size-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <h5 className="font-medium text-sm truncate">
                            {item.title}
                          </h5>
                          <span className="text-xs font-mono font-bold text-primary whitespace-nowrap">
                            {Number(item.subtotal).toLocaleString()}{" "}
                            {booking.currency}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                        {item.startTime && (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                            <RiCalendar2Line className="size-3" />
                            {item.startTime}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
