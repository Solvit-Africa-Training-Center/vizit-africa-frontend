import { getRequests } from "@/lib/data-fetching";
import DashboardClient from "./dashboard-client";

export default async function AdminDashboard() {
  const requests = await getRequests();

  return <DashboardClient initialRequests={requests} />;
}
