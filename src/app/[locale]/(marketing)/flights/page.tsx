import { getServices } from "@/lib/simple-data-fetching";
import FlightsClient from "./flights-client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function FlightsPage({ params }: PageProps) {
  await params;
  const flights = await getServices("flight");

  return <FlightsClient initialFlights={flights} />;
}
