import { notFound } from "next/navigation";
import { getRequestById } from "@/lib/simple-data-fetching";
import FulfillClient from "./fulfill-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FulfillPage({ params }: PageProps) {
  const { id } = await params;
  const request = await getRequestById(id);

  if (!request) {
    notFound();
  }

  return <FulfillClient booking={request} />;
}
