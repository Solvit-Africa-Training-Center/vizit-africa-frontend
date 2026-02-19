import { getVendors } from "@/actions/vendors";
import AdminVendorsClient from "./admin-vendors-client";

export default async function AdminVendorsPage() {
  const result = await getVendors();
  const vendors = result.success ? result.data : [];

  return <AdminVendorsClient vendors={vendors} />;
}
