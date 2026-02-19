import { getServices } from "@/lib/data-fetching";
import InventoryClient from "./inventory-client";

export default async function InventoryPage() {
  const [services] = await Promise.all([getServices()]);

  return <InventoryClient services={services} />;
}
