import { getRequests } from "@/lib/simple-data-fetching";
import RequestsClient from "./requests-client";

export default async function RequestsPage() {
  const requests = await getRequests();

  return <RequestsClient requests={requests} />;
}
