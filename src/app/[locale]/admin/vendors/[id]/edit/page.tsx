import { getVendorById } from "@/lib/data-fetching";
import { VendorForm } from "@/components/forms/admin/vendor-form";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { RiArrowLeftLine, RiBuilding4Line } from "@remixicon/react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVendorPage({ params }: PageProps) {
  const { id } = await params;
  const vendor = await getVendorById(id);
  const t = await getTranslations("Admin.vendors");

  if (!vendor) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
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
            <RiBuilding4Line className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">Edit Vendor</h1>
            <p className="text-muted-foreground">
              Update vendor details and contact information
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <VendorForm
          initialData={vendor}
          onSuccess={async () => {
            "use server";
            redirect("/admin/inventory");
          }}
        />
      </div>
    </div>
  );
}
