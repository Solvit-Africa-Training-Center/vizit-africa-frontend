"use client";

import { useTripStore } from "@/store/trip-store";
import { Button } from "@/components/ui/button";
import { RiCheckLine, RiSuitcaseLine } from "@remixicon/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import type { Flight, Hotel, Car, Guide, Experience, Service, TripItem, TripItemType } from "@/lib/plan_trip-types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { v4 as uuidv4 } from 'uuid';

type AddToTripType =
  | "flight"
  | "hotel"
  | "car"
  | "guide"
  | "experience"
  | "service"
  | "note"
  | "destination";

interface AddToTripButtonProps {
  type: AddToTripType;
  item?: Flight | Hotel | Car | Guide | Experience | Service;
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
  experience: "🦁 Experience added to your trip",
  service: "🛠 Service added to your trip",
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

  // Check if item is already added. 
  // For 'destination', we check tripInfo. 
  // For others, checking if an item with same ID exists in `items`.
  const isAdded = (() => {
    if (type === "destination") {
        return store.tripInfo.destination === destination;
    }
    if (type === "note") {
        // Notes are hard to check for uniqueness without ID, maybe just specific logic?
        // For now, let's assume notes are append-only and always "addable" unless we want to debounce.
        return false; 
    }
    if (item && 'id' in item) {
        return store.items.some(i => i.id === item.id);
    }
    return false;
  })();

  const handleAdd = () => {
    if (type === "destination" && destination) {
        store.setDestination(destination);
    } else if (type === "note" && note) {
        // Create a note item
        const noteItem: TripItem = {
            id: uuidv4(),
            type: "note",
            title: "Special Request / Note",
            description: note,
            data: note
        };
        store.addItem(noteItem);
    } else if (item) {
        // Construct TripItem from generic item
        // We assume 'item' has at least id, title (or name/model), price (maybe)
        // We strictly cast for convenience, but we should be careful.
        
        let title = "Unknown Item";
        let price = 0;
        let description = "";

        // Safe extraction based on type
        if (type === "flight") {
            const f = item as Flight;
            title = `${f.airline} - ${f.flightNumber}`;
            price = f.price;
            description = `${f.departureCity} to ${f.arrivalCity}`;
        } else if (type === "hotel") {
            const h = item as Hotel;
            title = h.name;
            price = h.pricePerNight; // Needs consideration for dates
            description = h.address;
        } else if (type === "car") {
            const c = item as Car;
            title = `${c.model} (${c.category})`;
            price = c.pricePerDay;
            description = withDriver ? "With Driver" : "Self Drive";
        } else if (type === "guide") {
            const g = item as Guide;
            title = `${g.type} Guide`;
            price = g.price;
            description = g.description;
        } else if (type === "experience") {
            const e = item as Experience;
            title = e.title;
            price = e.price;
            description = e.description || "";
        } else if (type === "service") {
            const s = item as Service;
            title = s.title;
            // price might be string in Service type, need parsing if we want number
            // or just store as is in data
            price = typeof s.price === 'number' ? s.price : 0; 
            description = s.description || "";
        }

        const newItem: TripItem = {
            id: item.id,
            type: type as TripItemType,
            title,
            description,
            price,
            data: { ...item, withDriver }, // store full object
            quantity: 1
        };
        
        store.addItem(newItem);
    }

    toast.success(toastMessages[type], {
      action: {
        label: "View Trip",
        onClick: () => {
          router.push(`/${locale}/plan-trip/review`);
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
