import { RiArrowLeftLine, RiMapPin2Line } from "@remixicon/react";
import { notFound, redirect } from "next/navigation";
import { ServiceForm } from "@/components/forms/admin/service-form";
import { Link } from "@/i18n/navigation";
import { getServiceById } from "@/lib/simple-data-fetching";
import { serviceSchema, type ServiceResponse } from "@/lib/unified-types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href="/admin/inventory"
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
            redirect("/admin/inventory");
          }}
        />
      </div>
    </div>
  );
}
