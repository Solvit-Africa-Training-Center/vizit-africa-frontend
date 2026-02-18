import { getServices } from "@/lib/data-fetching";
import PlanTripClient from "./plan-trip-client";
import type { Hotel, Car, Guide } from "@/lib/plan_trip-types";
import type { ServiceResponse } from "@/lib/schema/service-schema";

export default async function PlanTripPage() {
  const [hotelsData, carsData, guidesData] = await Promise.all([
    getServices("hotel"),
    getServices("car_rental"),
    getServices("guide"),
  ]);

  const hotels: Hotel[] = hotelsData.map((h: ServiceResponse) => ({
    id: String(h.id),
    name: h.title,
    address: (h.location as string) || "",
    location: (h.location as string) || "",
    stars: (h.metadata?.rating as number) || 0,
    pricePerNight: Number(h.base_price),
    amenities: (h.metadata?.amenities as string[]) || [],
    rating: (h.metadata?.rating as number) || 0,
  }));

  const cars: Car[] = carsData.map((c: ServiceResponse) => ({
    id: String(c.id),
    model: c.title,
    category: (c.service_type === "car_rental" ? "sedan" : c.service_type) as "sedan" | "suv" | "van", // fallback or map correctly
    pricePerDay: Number(c.base_price),
    seats: (c.metadata?.capacity as number) || 4,
    transmission: (c.metadata?.transmission as string) || "Automatic",
    fuelType: (c.metadata?.fuelType as string) || "Petrol",
    features: (c.metadata?.features as string[]) || [],
  }));

  const guides: Guide[] = guidesData.map((g: ServiceResponse) => ({
    id: String(g.id),
    name: g.title,
    type: (g.metadata?.type as string) || "Guide",
    description: g.description || "",
    price: Number(g.base_price),
    languages: (g.metadata?.languages as string[]) || [],
  }));

  return <PlanTripClient hotels={hotels} cars={cars} guides={guides} />;
}
