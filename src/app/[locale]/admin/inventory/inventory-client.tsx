"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type DataTableFilterField,
  type DataTableState,
} from "@/components/ui/data-table";
import { RiAddLine } from "@remixicon/react";
import { serviceColumns } from "./columns";
import { useTranslations } from "next-intl";
import type { ServiceResponse } from "@/lib/schema/service-schema";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/data-fetching";
import { Spinner } from "@/components/ui/spinner";

interface InventoryClientProps {
  initialServices?: ServiceResponse[];
}

export default function InventoryClient({
  initialServices,
}: InventoryClientProps) {
  const t = useTranslations("Admin.inventory");
  const router = useRouter();

  const [tableState, setTableState] = useState<DataTableState>({
    sorting: [],
    columnFilters: [],
    columnVisibility: {},
    rowSelection: {},
    pagination: { pageIndex: 0, pageSize: 10 },
  });

  const handleStateChange = (updates: Partial<DataTableState>) => {
    setTableState((prev) => ({ ...prev, ...updates }));
  };

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services", tableState.columnFilters, tableState.sorting, tableState.pagination],
    queryFn: () => getServices(),
    initialData: initialServices,
  });

  // Define filters for Services
  const serviceFilters: DataTableFilterField[] = [
    {
      label: "Type",
      value: "service_type",
      options: [
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
        { label: "Draft", value: "draft" },
      ],
    },
  ];

  const handleAddNew = () => {
    // Navigate to create service page or open modal
  };

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
          <Button onClick={handleAddNew}>
            <RiAddLine className="size-4 mr-2" />
            {t("addNew")}
          </Button>
        </div>
      </div>

      {isLoading && !services ? (
        <div className="flex justify-center py-20">
          <Spinner className="size-8" />
        </div>
      ) : (
        <DataTable
          columns={serviceColumns}
          data={services || []}
          filterFields={serviceFilters}
          searchPlaceholder="Search services..."
          searchColumn="title"
          state={tableState}
          callbacks={{ onStateChange: handleStateChange }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
