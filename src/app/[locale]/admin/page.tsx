import { getRequests } from "@/lib/simple-data-fetching";
import DashboardClient from "./dashboard-client";

export default async function AdminDashboard() {
  const requests = await getRequests();
console.log({requests})
  return <DashboardClient requests={requests} />;
}
