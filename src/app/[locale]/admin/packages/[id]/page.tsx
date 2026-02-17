import { notFound } from "next/navigation";
import { PackageBuilderClient } from "@/components/admin/package-builder-client";
import { getRequestById } from "@/lib/data-fetching";

interface PackageBuilderProps {
  params: Promise<{ id: string }>;
}

export default async function PackageBuilder({ params }: PackageBuilderProps) {
  const { id } = await params;
  const request = await getRequestById(id);

  if (!request) {
    notFound();
  }

  return <PackageBuilderClient request={request} />;
}
