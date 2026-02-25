"use client";

import { RiCalendar2Line, RiMapPin2Line, RiArrowRightUpLine } from "@remixicon/react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { type Booking } from "@/lib/unified-types";

interface TripCardProps {
  booking: Booking;
}

export function TripCard({ booking }: TripCardProps) {
  const startDate = booking.items[0]?.start_date || booking.arrivalDate;
  const endDate = booking.items[booking.items.length - 1]?.end_date || booking.departureDate;
  
  // Choose a random image from the collection for the card background
  const images = [
    "/images/rwanda-landscape.jpg",
    "/images/nyungwe-park.jpg",
    "/images/a-hill.jpg",
    "/images/lake-kivu-sunset.jpg"
  ];
  const bgImage = images[Math.abs(booking.id.toString().length) % images.length];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={bgImage}
          alt={booking.tripPurpose || "Trip"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
        
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
            {booking.status}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-display text-2xl font-medium tracking-tight mb-1">
            {booking.tripPurpose || "Adventure in Rwanda"}
          </h3>
          <div className="flex items-center gap-3 text-xs font-light opacity-90">
            <span className="flex items-center gap-1">
              <RiCalendar2Line className="size-3" />
              {startDate ? format(parseISO(startDate), "MMM d") : "TBD"} — {endDate ? format(parseISO(endDate), "MMM d, yyyy") : "TBD"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Itinerary
            </p>
            <p className="text-sm text-foreground/80">
              {booking.items.length} Activities & Services
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Total Value
            </p>
            <p className="text-sm font-mono font-bold text-primary">
              {booking.currency} {Number(booking.total_amount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2].map((_, i) => (
              <div key={i} className="size-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                {i === 0 ? "SA" : "NK"}
              </div>
            ))}
            <div className="size-7 rounded-full border-2 border-card bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
              +{booking.travelers}
            </div>
          </div>

          <Link href={`/profile/bookings/${booking.id}`}>
            <Button variant="ghost" size="sm" className="group/btn gap-1 h-8 rounded-full hover:bg-primary/5 hover:text-primary transition-all">
              Details
              <RiArrowRightUpLine className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
