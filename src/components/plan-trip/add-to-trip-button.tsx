"use client";

import { useTripStore } from "@/store/trip-store";
import { Button } from "@/components/ui/button";
import { RiCheckLine, RiSuitcaseLine } from "@remixicon/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import type { Flight, Hotel, Car, Guide } from "@/lib/plan_trip-types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type AddToTripType =
  | "flight"
  | "hotel"
  | "car"
  | "guide"
  | "note"
  | "destination";

interface AddToTripButtonProps {
  type: AddToTripType;
  item?: Flight | Hotel | Car | Guide;
  note?: string;
  destination?: string;
  withDriver?: boolean;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const toastMessages: Record<AddToTripType, string> = {
  flight: "✈ Flight added to your trip",
  hotel: "🏨 Hotel added to your trip",
  car: "🚗 Vehicle added to your trip",
  guide: "🧑‍💼 Guide added to your trip",
  note: "📝 Note added to your trip",
  destination: "📍 Destination set for your trip",
};

export function AddToTripButton({
  type,
  item,
  note,
  destination,
  withDriver,
  label = "Add to Trip",
  variant = "outline",
  size = "sm",
  className,
}: AddToTripButtonProps) {
  const store = useTripStore();
  const router = useRouter();
  const locale = useLocale();

  const isAdded = (() => {
    switch (type) {
      case "flight":
        return store.selections.flight?.id === (item as Flight)?.id;
      case "hotel":
        return store.selections.hotel?.id === (item as Hotel)?.id;
      case "car":
        return store.selections.car?.id === (item as Car)?.id;
      case "guide":
        return store.selections.guide?.id === (item as Guide)?.id;
      case "destination":
        return store.tripInfo.destination === destination;
      default:
        return false;
    }
  })();

  const handleAdd = () => {
    switch (type) {
      case "flight":
        store.addFlight(item as Flight);
        break;
      case "hotel":
        store.addHotel(item as Hotel);
        break;
      case "car":
        store.addCar(item as Car, withDriver);
        break;
      case "guide":
        store.addGuide(item as Guide);
        break;
      case "note":
        if (note) store.addNote(note);
        break;
      case "destination":
        if (destination) store.setDestination(destination);
        break;
    }

    toast.success(toastMessages[type], {
      action: {
        label: "View Trip",
        onClick: () => {
          router.push(`/${locale}/plan-trip`);
        },
      },
    });
  };

  return (
    <Button
      variant={isAdded ? "default" : variant}
      size={size}
      className={cn(
        "gap-1.5 transition-all duration-300",
        isAdded && "pointer-events-none",
        className,
      )}
      onClick={handleAdd}
      disabled={isAdded}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5"
          >
            <RiCheckLine className="size-4" />
            Added
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5"
          >
            <RiSuitcaseLine className="size-4" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
