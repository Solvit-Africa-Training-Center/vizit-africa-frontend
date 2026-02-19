import type { ServiceResponse } from "@/lib/schema/service-schema";
import { cn } from "@/lib/utils";
import { RiArrowRightUpLine } from "@remixicon/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { AddToTripButton } from "./plan-trip/add-to-trip-button";

const TYPE_LABELS: Record<string, string> = {
  hotel: "Hotels",
  bnb: "BnBs",
  car_rental: "Car Rentals",
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

export function ServiceItem({
  service,
  isExpanded,
  onToggle,
  bookLabel,
}: {
  service: ServiceResponse;
  isExpanded: boolean;
  onToggle: () => void;
  bookLabel: string;
}) {
  const category = TYPE_LABELS[service.service_type] || service.service_type;
  const price = formatPrice(service);
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
            {price}
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

                <div className="flex gap-4">
                  <AddToTripButton
                    type="service"
                    item={{
                      id: String(service.id),
                      title: service.title,
                      price:
                        typeof service.base_price === "string"
                          ? Number.parseFloat(service.base_price)
                          : service.base_price,
                      image,
                    }}
                    label={bookLabel}
                    size="lg"
                    className="px-8 rounded-none h-14 uppercase tracking-widest font-display text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
