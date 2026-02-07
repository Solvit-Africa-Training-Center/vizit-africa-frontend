import Link from "next/link";
import { RiDashboardLine, RiFileListLine } from "@remixicon/react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getRequests } from "@/lib/data-fetching";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Requests | Vizit Africa Admin",
  description: "Manage incoming travel requests and itineraries.",
};

export default async function RequestsPage() {
  const requests = await getRequests();

  const filters = [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Quoted", value: "quoted" },
        { label: "Confirmed", value: "confirmed" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Travel Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage incoming travel requests
          </p>
        </div>
      </div>

      {/* nav tabs */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted text-sm font-medium transition-colors"
        >
          <RiDashboardLine className="size-4" />
          Overview
        </Link>
        <Link
          href="/admin/requests"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          <RiFileListLine className="size-4" />
          Requests
        </Link>
      </div>

      {/* Unified Data Table with filters */}
      <DataTable columns={columns} data={requests} filters={filters} />
    </div>
  );
}
