import { getServiceById } from "@/lib/data-fetching";
import { ServiceForm } from "@/components/forms/admin/service-form";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { RiArrowLeftLine, RiMapPin2Line } from "@remixicon/react";
import Link from "next/link";
import { ServiceResponse } from "@/lib/schema/service-schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const service = await getServiceById(id);
  const t = await getTranslations("Admin.services");

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href="/admin/inventory?tab=services"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <RiArrowLeftLine className="size-4" />
          Back to Inventory
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <RiMapPin2Line className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">
              Edit Service
            </h1>
            <p className="text-muted-foreground">
              Update service details, pricing, and availability
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <ServiceForm
          initialData={service as ServiceResponse}
          onSuccess={async () => {
            "use server";
            redirect("/admin/inventory?tab=services");
          }}
        />
      </div>
    </div>
  );
}
