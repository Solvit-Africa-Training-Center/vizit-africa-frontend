import { getServices } from "@/lib/data-fetching";
import ExperiencesClient from "./experiences-client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ExperiencesPage({ params }: PageProps) {
  await params;
  const experiences = await getServices("experience");

  return <ExperiencesClient initialExperiences={experiences} />;
}
