"use client";

import { useForm } from "@tanstack/react-form";
import { useTripStore } from "@/store/trip-store";
import { submitTripRequest } from "@/actions/bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface TripFormValues {
  departureCity: string;
  destination: string;
  arrivalDate: string;
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
  const { tripInfo, items, clearTrip } = useTripStore();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      departureCity: tripInfo.departureCity,
      destination: tripInfo.destination || "",
      arrivalDate: tripInfo.arrivalDate,
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
    onSubmit: async ({ value }) => {
      const result = await submitTripRequest(value, items);

      if (result.success) {
        toast.success("Trip request submitted successfully!");
        clearTrip();
        router.push("/profile?tab=bookings");
      } else {
        toast.error(result.error || "Failed to submit trip request");
        console.error("Submission error:", result);
      }
    },
  });

  return form;
}

export type TripForm = ReturnType<typeof useTripForm>;
