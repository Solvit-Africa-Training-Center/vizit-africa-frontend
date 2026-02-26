import { getServices } from "@/lib/simple-data-fetching";
import ServicesClient from "./services-client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: PageProps) {
  await params;
  const services = await getServices();

  const filtered = services.filter(
    (s) => s.serviceType !== "flight" && s.serviceType !== "experience",
  );

  return <ServicesClient initialServices={filtered} />;
}
