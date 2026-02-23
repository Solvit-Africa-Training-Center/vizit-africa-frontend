import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { submitTripRequest } from "@/actions/bookings";
import { useTripStore } from "@/store/trip-store";

export interface TripFormValues {
  name: string;
  email: string;
  phone: string;
  departureCity: string;
  destination: string;
  arrivalDate: string;
  departureDate: string;
  returnDate: string;
  arrivalTime: string;
  departureTime: string;
  returnTime: string;
  isRoundTrip: boolean;
  adults: number;
  children: number;
  infants: number;
  tripPurpose: string;
  specialRequests: string;
  needsFlights: boolean;
  needsHotel: boolean;
  needsCar: boolean;
  needsGuide: boolean;
}

export function useTripForm() {
  const { tripInfo, items, clearTrip } = useTripStore();
  const t = useTranslations("PlanTrip");
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: tripInfo.name || "",
      email: tripInfo.email || "",
      phone: tripInfo.phone || "",
      departureCity: tripInfo.departureCity || "",
      destination: tripInfo.destination || "",
      arrivalDate: tripInfo.arrivalDate || "",
      departureDate: tripInfo.departureDate || "",
      returnDate: tripInfo.returnDate || "",
      arrivalTime: tripInfo.arrivalTime || "",
      departureTime: tripInfo.departureTime || "",
      returnTime: tripInfo.returnTime || "",
      isRoundTrip: tripInfo.isRoundTrip || false,
      adults: tripInfo.adults || 2,
      children: tripInfo.children || 0,
      infants: tripInfo.infants || 0,
      tripPurpose: tripInfo.tripPurpose || "leisure",
      specialRequests: tripInfo.specialRequests || "",
      needsFlights: tripInfo.needsFlights ?? true,
      needsHotel: tripInfo.needsHotel ?? true,
      needsCar: tripInfo.needsCar ?? false,
      needsGuide: tripInfo.needsGuide ?? false,
    } as TripFormValues,
    onSubmit: async ({ value }) => {
      try {
        const result = await submitTripRequest({ ...value, items });
        if (result.success) {
          toast.success("Trip request submitted successfully!");
          clearTrip();
          router.push("/plan-trip/confirmation");
        } else {
          toast.error(result.error || "Failed to submit request");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    },
  });

  return { form };
}

export type UseTripFormReturn = ReturnType<typeof useTripForm>;
