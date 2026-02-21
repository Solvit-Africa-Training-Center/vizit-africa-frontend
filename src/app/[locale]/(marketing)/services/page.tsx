import { getServices } from "@/lib/simple-data-fetching";
import ServicesClient from "./services-client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: PageProps) {
  await params;
  const services = await getServices();

  const filtered = services.filter(
    (s) => s.service_type !== "flight" && s.service_type !== "experience",
  );

  return <ServicesClient initialServices={filtered} />;
}
