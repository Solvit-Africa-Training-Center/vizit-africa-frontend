"use client";

import { useState } from "react";
import Link from "next/link";
import { RiDashboardLine, RiFileListLine } from "@remixicon/react";
import {
  DataTable,
  type DataTableState,
} from "@/components/ui/data-table";
import { columns } from "./columns";
import { getRequests } from "@/lib/data-fetching";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import type { Booking } from "@/lib/schema/booking-schema";

interface RequestsClientProps {
  initialRequests?: Booking[];
}

export default function RequestsClient({
  initialRequests,
}: RequestsClientProps) {
  const t = useTranslations("Admin.requests");
  const tNav = useTranslations("Admin.nav");

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

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-requests", tableState.columnFilters, tableState.sorting, tableState.pagination],
    queryFn: () => getRequests(),
    initialData: initialRequests,
  });

  const filterFields = [
    {
      value: "status",
      label: t("table.status"),
      options: [
        { label: "Pending", value: "pending" },
        { label: "Quoted", value: "quoted" },
        { label: "Confirmed", value: "confirmed" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
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

      {isLoading && !requests ? (
        <div className="flex justify-center py-20">
          <Spinner className="size-8" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={requests || []}
          filterFields={filterFields}
          state={tableState}
          callbacks={{ onStateChange: handleStateChange }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
