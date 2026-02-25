"use client";

import { RiStoreLine, RiTimeLine } from "@remixicon/react";
import { useState } from "react";
import { DataTable, type DataTableState } from "@/components/ui/data-table";
import { createDefaultDataTableState } from "@/components/ui/data-table-state";
import { vendorSchema, type VendorResponse } from "@/lib/unified-types";
import { pendingVendorColumns, vendorColumns } from "./columns";

interface AdminVendorsClientProps {
  vendors: VendorResponse[];
}

export default function AdminVendorsClient({
  vendors,
}: AdminVendorsClientProps) {
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");
  const [activeTableState, setActiveTableState] = useState(
    createDefaultDataTableState(),
  );
  const [pendingTableState, setPendingTableState] = useState(
    createDefaultDataTableState(),
  );

  const tableState =
    activeTab === "active" ? activeTableState : pendingTableState;

  const handleStateChange = (updates: Partial<DataTableState>) => {
    if (activeTab === "active") {
      setActiveTableState((prev) => ({ ...prev, ...updates }));
      return;
    }

    setPendingTableState((prev) => ({ ...prev, ...updates }));
  };

  const activeVendors = vendors.filter((v) => v.is_approved);
  const pendingVendors = vendors.filter((v) => !v.is_approved);

  const vendorFilters = [
    {
      label: "Type",
      value: "vendor_type",
      options: [
        { label: "Hotel", value: "hotel" },
        { label: "Car Rental", value: "car_rental" },
        { label: "Guide", value: "guide" },
        { label: "Experience", value: "experience" },
        { label: "Transport", value: "transport" },
        { label: "Other", value: "other" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-9xl px-5 md:px-10 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            Vendor Management
          </h1>
          <p className="text-muted-foreground">
            Manage authorized vendors and review new applications.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "active"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <RiStoreLine className="size-4" />
          Active Vendors
          <span className="ml-1 text-xs bg-muted px-2 py-0.5 rounded-full">
            {activeVendors.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "pending"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <RiTimeLine className="size-4" />
          Pending Requests
          {pendingVendors.length > 0 && (
            <span className="ml-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full border border-primary-200">
              {pendingVendors.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "active" ? (
        <DataTable
          columns={vendorColumns}
          data={activeVendors}
          filterFields={vendorFilters}
          searchPlaceholder="Search active vendors..."
          searchColumn="business_name"
          state={tableState}
          callbacks={{ onStateChange: handleStateChange }}
        />
      ) : (
        <DataTable
          columns={pendingVendorColumns}
          data={pendingVendors}
          filterFields={vendorFilters}
          searchPlaceholder="Search pending requests..."
          searchColumn="business_name"
          state={tableState}
          callbacks={{ onStateChange: handleStateChange }}
        />
      )}
    </div>
  );
}
