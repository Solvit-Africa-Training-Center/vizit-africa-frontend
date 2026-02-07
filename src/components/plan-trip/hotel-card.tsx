"use client";

import type { Hotel } from "../../lib/plan_trip-types";
import { Badge } from "@/components/ui/badge";
import { RiMapPinLine, RiCheckLine, RiHotelLine } from "@remixicon/react";

interface HotelCardProps {
  hotel: Hotel;
  isSelected: boolean;
  days: number;
  onSelect: () => void;
}

export function HotelCard({
  hotel,
  isSelected,
  days,
  onSelect,
}: HotelCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary-subtle"
          : "border-border bg-white hover:border-primary/50"
      }`}
    >
      <div className="aspect-video bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <RiHotelLine className="size-10 text-muted-foreground/50" />
        </div>

        {isSelected && (
          <div className="absolute top-2 right-2 size-6 rounded-full bg-primary text-white flex items-center justify-center">
            <RiCheckLine className="size-4" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
          {hotel.name}
        </h4>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
          <RiMapPinLine className="size-3 shrink-0" />
          <span className="line-clamp-1">{hotel.address}</span>
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {hotel.amenities.slice(0, 3).map((a) => (
            <Badge key={a} variant="secondary" className="text-xs">
              {a}
            </Badge>
          ))}
          {hotel.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{hotel.amenities.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">{days} nights</p>
            <p className="font-bold text-lg text-foreground">
              ${hotel.pricePerNight * days}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            ${hotel.pricePerNight}/night
          </p>
        </div>
      </div>
    </div>
  );
}
