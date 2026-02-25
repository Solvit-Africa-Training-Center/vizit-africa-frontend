import { useForm } from "@tanstack/react-form";
import { useRouter } from "@/i18n/navigation";
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
  const { tripInfo } = useTripStore();
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
      useTripStore.getState().updateTripInfo(value);

      router.push("/plan-trip/review");
    },
  });

  return { form };
}

export type UseTripFormReturn = ReturnType<typeof useTripForm>;
