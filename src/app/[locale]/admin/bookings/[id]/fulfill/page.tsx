import { getRequestById } from "@/lib/data-fetching";
import FulfillClient from "./fulfill-client";
import { notFound } from "next/navigation";

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
