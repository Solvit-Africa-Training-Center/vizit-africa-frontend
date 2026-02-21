import { getServices } from "@/lib/simple-data-fetching";
import { serviceSchema, type ServiceResponse } from "@/lib/unified-types";
import { type Hotel, type Car, type Guide } from "@/lib/plan_trip-types";
import PlanTripClient from "./plan-trip-client";

export default async function PlanTripPage() {
  const [hotelsData, carsData, guidesData] = await Promise.all([
    getServices("hotel"),
    getServices("car_rental"),
    getServices("guide"),
  ]);

  const hotels: Hotel[] = hotelsData.map((h: ServiceResponse) => ({
    id: String(h.id),
    title: h.title,
    description: h.description,
    location: (h.location as string) || "",
    price: Number(h.base_price),
    amenities: (h.metadata?.amenities as string[]) || [],
    rating: (h.metadata?.rating as number) || 0,
  }));

  const cars: Car[] = carsData.map((c: ServiceResponse) => ({
    id: String(c.id),
    title: c.title,
    description: c.description,
    price: Number(c.base_price),
    seats: (c.metadata?.capacity as number) || 4,
    features: (c.metadata?.features as string[]) || [],
    rating: (c.metadata?.rating as number) || 0,
  }));

  const guides: Guide[] = guidesData.map((g: ServiceResponse) => ({
    id: String(g.id),
    title: g.title,
    description: g.description || "",
    price: Number(g.base_price),
    languages: (g.metadata?.languages as string[]) || [],
    rating: (g.metadata?.rating as number) || 0,
  }));

  return <PlanTripClient hotels={hotels} cars={cars} guides={guides} />;
}
