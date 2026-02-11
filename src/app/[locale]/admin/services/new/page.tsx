import { ServiceForm } from "@/components/forms/admin/service-form";
import { useTranslations } from "next-intl";

export default function CreateServicePage() {
  // const t = useTranslations("Admin.services");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight">Create Service</h1>
        <p className="text-muted-foreground mt-2">
          Add a new service to the catalog by selecting a vendor and filling out
          the details.
        </p>
      </div>

      <ServiceForm />
    </div>
  );
}
