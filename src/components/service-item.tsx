import { RiArrowRightUpLine, RiMapPinLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { getLocations } from "@/actions/locations";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { serviceSchema, type ServiceResponse } from "@/lib/unified-types";
import { cn, IMAGE_PLACEHOLDER } from "@/lib/utils";
import { AddToTripButton } from "./plan-trip/add-to-trip-button";
import { Button } from "./ui/button";

import { useTranslations } from "next-intl";

const TYPE_LABELS: Record<string, string> = {
  hotel: "categories.hotels",
  bnb: "categories.bnbs",
  car_rental: "categories.carRentals",
  car: "categories.carRentals",
  guide: "categories.guides",
  flight: "categories.flights",
  experience: "categories.experiences",
};

function getImage(service: ServiceResponse): string {
  const media = service.media;
  if (media && media.length > 0) {
    const firstMedia = media[0];
    if (typeof firstMedia === "string" && firstMedia) return firstMedia;
    if (
      typeof firstMedia === "object" &&
      firstMedia !== null &&
      "media_url" in firstMedia &&
      typeof firstMedia.media_url === "string" &&
      firstMedia.media_url
    ) {
      return firstMedia.media_url;
    }
  }
  return IMAGE_PLACEHOLDER;
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
  const t = useTranslations("ServicesPage");
  const [withDriver, setWithDriver] = useState(false);
  const categoryKey = TYPE_LABELS[service.serviceType] || service.serviceType;
  const category = categoryKey.includes(".") ? t(categoryKey) : categoryKey;

  const { data: locationsResponse } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await getLocations();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: isExpanded && !!service.location,
  });

  const locationDetails = locationsResponse?.find(
    (loc) => String(loc.id) === String(service.location),
  );

  const basePrice =
    typeof service.basePrice === "string"
      ? Number.parseFloat(service.basePrice)
      : service.basePrice;

  const displayPrice =
    (service.serviceType === ("car" as any) ||
      service.serviceType === ("car_rental" as any)) &&
    withDriver
      ? basePrice + driverSurcharge
      : basePrice;

  const priceFormatted = `$${displayPrice.toLocaleString()}${
    service.serviceType === ("hotel" as any) ||
    service.serviceType === ("bnb" as any)
      ? t("labels.night")
      : service.serviceType === ("car_rental" as any) ||
          service.serviceType === ("guide" as any) ||
          service.serviceType === ("car" as any)
        ? t("labels.day")
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
            <div className="pb-12 md:pb-16 grid lg:grid-cols-12 gap-8 md:gap-16">
              <div className="lg:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden bg-muted group/img">
                <Image
                  src={image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                />
              </div>
              <div className="lg:col-span-7 flex flex-col justify-between py-2">
                <div>
                  <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-foreground/80">
                    {service.description}
                  </p>

                  {locationDetails?.latitude && locationDetails?.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${locationDetails.latitude},${locationDetails.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12 group/location"
                    >
                      <RiMapPinLine className="size-4 group-hover/location:-translate-y-0.5 transition-transform" />
                      <span className="underline underline-offset-8 decoration-border/50 group-hover/location:decoration-primary transition-colors">
                        {locationDetails.name} • {locationDetails.latitude},{" "}
                        {locationDetails.longitude}
                      </span>
                    </a>
                  )}
                </div>

                <div className="flex flex-col gap-8">
                  {(service.serviceType === ("car" as any) ||
                    service.serviceType === ("car_rental" as any)) && (
                    <div className="flex items-center space-x-3 bg-muted/30 p-4 rounded-xl w-fit">
                      <Checkbox
                        id={`driver-${service.id}`}
                        checked={withDriver}
                        onCheckedChange={(c) => setWithDriver(!!c)}
                      />
                      <Label
                        htmlFor={`driver-${service.id}`}
                        className="text-xs font-mono uppercase tracking-widest cursor-pointer"
                      >
                        {t("labels.addDriver", { price: driverSurcharge })}
                      </Label>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {onSelect ? (
                      <Button
                        size="lg"
                        variant={isSelected ? "destructive" : "default"}
                        className="px-8 rounded-full h-11 uppercase tracking-widest font-display text-[10px] shadow-lg shadow-primary/10"
                        onClick={() => onSelect(service, { withDriver })}
                      >
                        {isSelected ? t("labels.remove") : bookLabel}
                      </Button>
                    ) : (
                      <AddToTripButton
                        type={mapServiceTypeToTripType(service.serviceType)}
                        item={
                          {
                            id: String(service.id),
                            title: service.title,
                            price:
                              typeof service.basePrice === "string"
                                ? Number.parseFloat(service.basePrice)
                                : service.basePrice,
                            image,

                            model: service.title,
                            category: "suv",
                            price_per_day:
                              typeof service.basePrice === "string"
                                ? parseFloat(service.basePrice)
                                : service.basePrice,
                            seats: service.capacity,
                            transmission: t("labels.fallbackTransmission"),

                            name: service.title,
                            price_per_night:
                              typeof service.basePrice === "string"
                                ? parseFloat(service.basePrice)
                                : service.basePrice,
                            address: service.description,
                            amenities: [],
                            stars: 4,
                            location:
                              typeof service.location === "string"
                                ? service.location
                                : t("labels.fallbackLocation"),

                            type: "guide",
                            description: service.description,
                          } as any
                        }
                        label={bookLabel}
                        size="lg"
                        className="px-8 rounded-full h-11 uppercase tracking-widest font-display text-[10px] shadow-lg shadow-primary/10"
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
