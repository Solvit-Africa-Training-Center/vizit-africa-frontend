import { getVendors } from "@/lib/simple-data-fetching";
import AdminVendorsClient from "./admin-vendors-client";

export default async function AdminVendorsPage() {
  const vendors = await getVendors();

  return <AdminVendorsClient vendors={vendors} />;
}
