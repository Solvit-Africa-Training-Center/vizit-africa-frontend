"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Request } from "@/lib/schemas"; // Ensure Request type is imported correctly

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-foreground">
          {row.getValue("name")}
        </div>
        <div className="text-sm text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorFn: (row) => `${row.arrivalDate} ${row.departureDate}`,
    id: "dates",
    header: "Travel Dates",
    cell: ({ row }) => (
      <div>
        <div className="text-sm text-foreground">
          {row.original.arrivalDate}
        </div>
        <div className="text-sm text-muted-foreground">
          to {row.original.departureDate}
        </div>
      </div>
    ),
  },
  {
    id: "services",
    header: "Services",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.needsFlights && (
          <Badge variant="secondary" className="text-xs font-normal">
            Flights
          </Badge>
        )}
        {row.original.needsHotel && (
          <Badge variant="secondary" className="text-xs font-normal">
            Hotels
          </Badge>
        )}
        {row.original.needsCar && (
          <Badge variant="secondary" className="text-xs font-normal">
            Car
          </Badge>
        )}
        {row.original.needsGuide && (
          <Badge variant="secondary" className="text-xs font-normal">
            Guide
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={`
            ${
              status === "pending"
                ? "bg-yellow-500/15 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30"
                : status === "quoted"
                  ? "bg-blue-500/15 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30"
                  : "bg-green-500/15 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30"
            } border`}
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Link
          href={`/admin/packages/${row.original.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {row.original.status === "pending" ? "Create Package" : "View"}
        </Link>
      </div>
    ),
  },
];
