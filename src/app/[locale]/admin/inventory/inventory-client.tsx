"use client";

import { RiAddLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type DataTableFilterField,
  type DataTableState,
} from "@/components/ui/data-table";
import { createDefaultDataTableState } from "@/components/ui/data-table-state";
import { Link } from "@/i18n/navigation";
import { serviceSchema, type ServiceResponse } from "@/lib/unified-types";
import { serviceColumns } from "./columns";

interface InventoryClientProps {
  services: ServiceResponse[];
}

export default function InventoryClient({ services }: InventoryClientProps) {
  const t = useTranslations("Admin.inventory");

  const [tableState, setTableState] = useState(createDefaultDataTableState());

  const handleStateChange = (updates: Partial<DataTableState>) => {
    setTableState((prev) => ({ ...prev, ...updates }));
  };

  // Define filters for Services
  const serviceFilters: DataTableFilterField[] = [
    {
      label: "Type",
      value: "service_type",
      options: [
        { label: "Flight", value: "flight" },
        { label: "Hotel", value: "hotel" },
        { label: "Car", value: "car" },
        { label: "Activity", value: "activity" },
        { label: "Experience", value: "experience" },
        { label: "Tour", value: "tour" },
        { label: "Guide", value: "guide" },
      ],
    },
    {
      label: "Status",
      value: "status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
        { label: "Deleted", value: "deleted" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div>
          <Button render={<Link href="/admin/create/service" />}>
            <RiAddLine className="size-4 mr-2" />
            {t("addNew")}
          </Button>
        </div>
      </div>

      <DataTable
        columns={serviceColumns}
        data={services}
        filterFields={serviceFilters}
        searchPlaceholder="Search services..."
        searchColumn="title"
        state={tableState}
        callbacks={{ onStateChange: handleStateChange }}
      />
    </div>
  );
}
