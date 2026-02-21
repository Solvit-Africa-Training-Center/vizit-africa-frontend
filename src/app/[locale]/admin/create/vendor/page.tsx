import { RiArrowLeftLine } from "@remixicon/react";
import { getTranslations } from "next-intl/server";
import { VendorForm } from "@/components/forms/admin/vendor-form";
import { Link } from "@/i18n";

const page = async () => {
  const t = await getTranslations("Admin.createVendor");
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          {t("back")}
        </Link>
      </div>

      <VendorForm />
    </div>
  );
};

export default page;
