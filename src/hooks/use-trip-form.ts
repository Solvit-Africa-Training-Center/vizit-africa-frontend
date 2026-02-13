"use client";

import { useForm } from "@tanstack/react-form";
import { useTripStore } from "@/store/trip-store";

export interface TripFormValues {
  departureCity: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  name: string;
  email: string;
  phone: string;
  tripPurpose:
    | "leisure"
    | "business"
    | "honeymoon"
    | "family"
    | "adventure"
    | "other";
  specialRequests: string;
}

export function useTripForm() {
  const { tripInfo, items } = useTripStore();

  const form = useForm({
    defaultValues: {
      departureCity: tripInfo.departureCity,
      destination: tripInfo.destination || "",
      departureDate: tripInfo.departureDate,
      returnDate: tripInfo.returnDate || "",
      adults: tripInfo.adults,
      children: tripInfo.children,
      infants: tripInfo.infants,
      name: tripInfo.name,
      email: tripInfo.email,
      phone: tripInfo.phone,
      tripPurpose: tripInfo.tripPurpose,
      specialRequests: tripInfo.specialRequests,
    },
    onSubmit: ({ value }) => {
      const payload = {
        ...value,
        items: items,
      };
      console.log("=== TRIP QUOTE REQUEST SUBMISSION ===");
      console.log(JSON.stringify(payload, null, 2));
    },
  });

  return form;
}

export type TripForm = ReturnType<typeof useTripForm>;
