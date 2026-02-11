import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n";
import { RiArrowLeftLine } from "@remixicon/react";
import { ServiceForm } from "@/components/forms/admin/service-form";

const page = async () => {
  const t = await getTranslations("Admin.createService");
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

      <ServiceForm />
    </div>
  );
};

export default page;
