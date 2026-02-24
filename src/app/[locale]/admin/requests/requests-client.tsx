"use client";

import { RiDashboardLine, RiFileListLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DataTable, type DataTableState } from "@/components/ui/data-table";
import { createDefaultDataTableState } from "@/components/ui/data-table-state";
import { Link } from "@/i18n/navigation";
import { bookingSchema, type Booking } from "@/lib/unified-types";
import { columns } from "./columns";

interface RequestsClientProps {
  requests: Booking[];
}

export default function RequestsClient({ requests }: RequestsClientProps) {
  const t = useTranslations("Admin.requests");
  const tNav = useTranslations("Admin.nav");

  const [tableState, setTableState] = useState(createDefaultDataTableState());

  const handleStateChange = (updates: Partial<DataTableState>) => {
    setTableState((prev) => ({ ...prev, ...updates }));
  };

  const filterFields = [
    {
      value: "status",
      label: t("table.status"),
      options: [
        { label: "Pending", value: "pending" },
        { label: "Quoted", value: "quoted" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Completed", value: "completed" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-9xl px-5 md:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted text-sm font-medium transition-colors"
        >
          <RiDashboardLine className="size-4" />
          {tNav("overview")}
        </Link>
        <Link
          href="/admin/requests"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          <RiFileListLine className="size-4" />
          {tNav("requests")}
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        filterFields={filterFields}
        state={tableState}
        searchColumn="name"
        searchPlaceholder="Search requests..."
        callbacks={{ onStateChange: handleStateChange }}
      />
    </div>
  );
}
