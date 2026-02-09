"use client";

import type { Hotel } from "../../lib/plan_trip-types";
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
      className={`group relative border transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-white hover:border-primary"
      }`}
    >
      {/* Selection Indicator */}
      <div
        className={`absolute top-0 right-0 p-3 z-10 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0"}`}
      >
        <div className="size-6 bg-primary text-primary-foreground flex items-center justify-center">
          <RiCheckLine className="size-4" />
        </div>
      </div>

      <div className="flex flex-col h-full">
        {/* Image Area */}
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <RiHotelLine className="size-10 text-muted-foreground/30" />
          </div>
          {/* Star Rating Badge */}
          <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-sm px-3 py-1 border-t border-r border-border">
            <div className="flex gap-0.5">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <span key={i} className="text-primary text-xs">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-4">
          <div>
            <h4 className="font-display text-xl font-bold uppercase tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <RiMapPinLine className="size-3.5 shrink-0" />
              <span className="text-sm font-light line-clamp-1">
                {hotel.address}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="text-[10px] uppercase tracking-wider px-2 py-1 border border-border text-muted-foreground"
              >
                {a}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 border border-border text-muted-foreground">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-border/50 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Total ({days} nights)
              </p>
              <p className="font-display text-xl font-bold text-foreground">
                ${hotel.pricePerNight * days}
              </p>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              ${hotel.pricePerNight}
              <span className="text-xs font-light">/night</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
