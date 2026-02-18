import { getServices } from "@/lib/data-fetching";
import InventoryClient from "./inventory-client";

export default async function InventoryPage() {
  const [hotels, cars, guides, flights] = await Promise.all([
    getServices("hotel"),
    getServices("car_rental"),
    getServices("guide"),
    getServices("flight"),
  ]);

  return (
    <InventoryClient
      hotels={hotels}
      cars={cars}
      guides={guides}
      flights={flights}
    />
  );
}
