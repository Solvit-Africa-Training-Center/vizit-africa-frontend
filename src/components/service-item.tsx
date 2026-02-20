import type { ServiceResponse } from "@/lib/schema/service-schema";
import { cn } from "@/lib/utils";
import { RiArrowRightUpLine } from "@remixicon/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { AddToTripButton } from "./plan-trip/add-to-trip-button";
import { Button } from "./ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const TYPE_LABELS: Record<string, string> = {
  hotel: "Hotels",
  bnb: "BnBs",
  car_rental: "Car Rentals",
  car: "Car Rentals",
  guide: "Guides",
  flight: "Flights",
  experience: "Experiences",
};

function formatPrice(service: ServiceResponse): string {
  const price =
    typeof service.base_price === "string"
      ? Number.parseFloat(service.base_price)
      : service.base_price;

  const suffix =
    service.service_type === "hotel" || service.service_type === "bnb"
      ? " / night"
      : service.service_type === "car_rental" ||
          service.service_type === "guide"
        ? " / day"
        : "";

  return `$${price.toLocaleString()}${suffix}`;
}

function getImage(service: ServiceResponse): string {
  const media = service.media;
  if (media && media.length > 0) return media[0].media_url;
  return "/images/rwanda-landscape.jpg";
}

const mapServiceTypeToTripType = (
  type: string,
): "hotel" | "car" | "guide" | "flight" | "experience" | "service" => {
  if (type === "hotel") return "hotel";
  if (type === "car" || type === "car_rental") return "car";
  if (type === "guide") return "guide";
  if (type === "flight") return "flight";
  if (type === "experience" || type === "activity" || type === "tour")
    return "experience";
  return "service";
};

export function ServiceItem({
  service,
  isExpanded,
  onToggle,
  bookLabel,
  onSelect,
  isSelected,
  driverSurcharge = 0,
}: {
  service: ServiceResponse;
  isExpanded: boolean;
  onToggle: () => void;
  bookLabel: string;
  onSelect?: (
    service: ServiceResponse,
    options?: { withDriver?: boolean },
  ) => void;
  isSelected?: boolean;
  driverSurcharge?: number;
}) {
  const [withDriver, setWithDriver] = useState(false);
  const category = TYPE_LABELS[service.service_type] || service.service_type;

  const basePrice =
    typeof service.base_price === "string"
      ? Number.parseFloat(service.base_price)
      : service.base_price;

  const displayPrice =
    (service.service_type === "car" || service.service_type === "car_rental") &&
    withDriver
      ? basePrice + driverSurcharge
      : basePrice;

  const priceFormatted = `$${displayPrice.toLocaleString()}${
    service.service_type === "hotel" || service.service_type === "bnb"
      ? " / night"
      : service.service_type === "car_rental" ||
          service.service_type === "guide" ||
          service.service_type === "car"
        ? " / day"
        : ""
  }`;

  const image = getImage(service);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-border/50 group"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left outline-hidden"
      >
        <div className="flex-1">
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-2 block">
            {category}
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-medium group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h2>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
          <span className="font-mono text-sm md:text-base text-muted-foreground">
            {priceFormatted}
          </span>
          <div
            className={cn(
              "size-8 rounded-full border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:text-primary",
              isExpanded ? "rotate-45" : "rotate-0",
            )}
          >
            <RiArrowRightUpLine className="size-4" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-12 md:pb-16 grid md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4 relative aspect-4/3 rounded-sm overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-foreground/90">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {(service.service_type === "car" ||
                    service.service_type === "car_rental") && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`driver-${service.id}`}
                        checked={withDriver}
                        onCheckedChange={(c) => setWithDriver(!!c)}
                      />
                      <Label
                        htmlFor={`driver-${service.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Add Driver (+${driverSurcharge}/day)
                      </Label>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {onSelect ? (
                      <Button
                        size="lg"
                        variant={isSelected ? "destructive" : "default"}
                        className="px-8 rounded-none h-14 uppercase tracking-widest font-display text-sm"
                        onClick={() => onSelect(service, { withDriver })}
                      >
                        {isSelected ? "Remove" : bookLabel}
                      </Button>
                    ) : (
                      <AddToTripButton
                        type={mapServiceTypeToTripType(service.service_type)}
                        item={{
                          id: String(service.id),
                          title: service.title,
                          price:
                            typeof service.base_price === "string"
                              ? Number.parseFloat(service.base_price)
                              : service.base_price,
                          image,

                          // Explicit mapping for specific types
                          // Car
                          model: service.title,
                          category: "suv",
                          pricePerDay:
                            typeof service.base_price === "string"
                              ? parseFloat(service.base_price)
                              : service.base_price,
                          seats: service.capacity,
                          transmission: "Automatic",

                          // Hotel
                          name: service.title,
                          pricePerNight:
                            typeof service.base_price === "string"
                              ? parseFloat(service.base_price)
                              : service.base_price,
                          address: service.description,
                          amenities: [],
                          stars: 4,
                          location:
                            typeof service.location === "string"
                              ? service.location
                              : "Kigali",

                          // Guide
                          type: "Guide",
                          description: service.description,
                        }}
                        label={bookLabel}
                        size="lg"
                        className="px-8 rounded-none h-14 uppercase tracking-widest font-display text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
