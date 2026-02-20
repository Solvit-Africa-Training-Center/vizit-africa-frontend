"use client";

import { motion } from "motion/react";
import { RiCheckDoubleLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { ServiceItem } from "@/components/service-item";
import { useState } from "react";
import type { TripItem, Hotel, Car, Guide } from "@/lib/plan_trip-types";
import type { ServiceResponse } from "@/lib/schema/service-schema";

interface AiResultsListProps {
  aiRecommendations: {
    destination: string;
    itinerarySummary: string;
    hotels: Hotel[];
    cars: Car[];
    guides: Guide[];
  };
  items: TripItem[];
  addItem: (item: TripItem) => void;
  removeItem: (id: string) => void;
  onClearAi: () => void;
  handleSelectHotel: (hotel: Hotel) => void;
  handleSelectCar: (car: Car) => void;
  days: number;
}

export function AiResultsList({
  aiRecommendations,
  items,
  addItem,
  removeItem,
  onClearAi,
  handleSelectHotel,
  handleSelectCar,
  days,
}: AiResultsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSelectAllAi = () => {
    // Add Hotels
    aiRecommendations.hotels.forEach((h) => {
      const exists = items.find((i) => i.id === h.id);
      if (!exists) {
        handleSelectHotel(h);
      }
    });

    // Add Cars
    aiRecommendations.cars.forEach((c) => {
      const exists = items.find((i) => i.id === c.id);
      if (!exists) {
        handleSelectCar(c);
      }
    });

    // Add Guides
    aiRecommendations.guides.forEach((g) => {
      const exists = items.find((i) => i.id === g.id);
      if (!exists) {
        addItem({
          id: g.id,
          type: "guide",
          title: g.name,
          description: g.description,
          price: g.price,
          data: g,
          quantity: 1,
        });
      }
    });
  };

  const aiServices: ServiceResponse[] = [
    ...aiRecommendations.hotels.map((h) => ({
      id: h.id,
      title: h.name,
      service_type: "hotel",
      description: h.location + " · " + h.amenities.slice(0, 3).join(", "),
      base_price: h.pricePerNight,
      currency: "USD",
      capacity: 2,
      status: "active",
      media: h.image
        ? [{ id: 1, media_url: h.image, media_type: "image", sort_order: 1 }]
        : [],
      user: "ai",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    ...aiRecommendations.cars.map((c) => ({
      id: c.id,
      title: c.model,
      service_type: "car",
      description: `${c.category} · ${c.transmission} · ${c.seats} seats`,
      base_price: c.pricePerDay,
      currency: "USD",
      capacity: c.seats,
      status: "active",
      media: c.image
        ? [{ id: 1, media_url: c.image, media_type: "image", sort_order: 1 }]
        : [],
      user: "ai",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    ...aiRecommendations.guides.map((g) => ({
      id: g.id,
      title: g.name,
      service_type: "guide",
      description: `${g.type} · ${g.description}`,
      base_price: g.price || 0,
      currency: "USD",
      capacity: 10,
      status: "active",
      media: g.image
        ? [{ id: 1, media_url: g.image, media_type: "image", sort_order: 1 }]
        : [],
      user: "ai",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display uppercase tracking-wider text-primary">
              AI Recommendations
            </h3>
            <p className="text-muted-foreground text-sm max-w-2xl">
              {aiRecommendations.itinerarySummary}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSelectAllAi}
              className="shrink-0 gap-2"
            >
              <RiCheckDoubleLine className="size-4" />
              Add All Results
            </Button>
            <Button variant="ghost" onClick={onClearAi} className="shrink-0">
              View Full Catalog
            </Button>
          </div>
        </div>

        <div className="border-t border-border">
          {aiServices.map((service) => (
            <ServiceItem
              key={String(service.id)}
              service={service as any}
              isExpanded={expandedId === String(service.id)}
              onToggle={() =>
                setExpandedId(
                  expandedId === String(service.id) ? null : String(service.id),
                )
              }
              bookLabel="Add to Trip"
              isSelected={!!items.find((i) => i.id === String(service.id))}
              onSelect={(s) => {
                const existing = items.find((i) => i.id === String(s.id));
                if (existing) {
                  removeItem(existing.id);
                  return;
                }

                const price =
                  typeof s.base_price === "string"
                    ? parseFloat(s.base_price)
                    : s.base_price;

                if (s.service_type === "hotel") {
                  handleSelectHotel({
                    id: String(s.id),
                    name: s.title,
                    location: typeof s.location === "string" ? s.location : "",
                    pricePerNight: price,
                    address: s.description || "",
                    rating: 4.5,
                    image: s.media?.[0]?.media_url || "",
                    amenities: [],
                    stars: 4,
                  } as Hotel);
                } else if (
                  s.service_type === "car" ||
                  s.service_type === "car_rental"
                ) {
                  handleSelectCar({
                    id: String(s.id),
                    model: s.title,
                    category: "suv",
                    transmission: "Automatic",
                    seats: s.capacity,
                    pricePerDay: price,
                    fuelType: "Petrol",
                    image: s.media?.[0]?.media_url || "",
                    features: [],
                  } as Car);
                } else if (s.service_type === "guide") {
                  addItem({
                    id: String(s.id),
                    type: "guide",
                    title: s.title,
                    description: s.description,
                    price: price,
                    data: { ...s },
                    quantity: 1,
                  });
                }
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
