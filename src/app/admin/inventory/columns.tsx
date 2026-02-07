"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { RiEditLine, RiDeleteBinLine, RiStarFill } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Hotel, Car, Guide, Flight } from "@/lib/schemas";

// Actions Cell Component
const ActionsCell = () => (
  <div className="flex justify-end gap-2">
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
    >
      <RiEditLine className="size-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
    >
      <RiDeleteBinLine className="size-4" />
    </Button>
  </div>
);

export const hotelColumns: ColumnDef<Hotel>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("location")}</div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <RiStarFill className="size-3.5 text-orange-400" />
        <span className="font-medium tabular-nums">
          {row.getValue("rating")}
        </span>
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "pricePerNight",
    header: "Price/Night",
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground">
        ${row.getValue("pricePerNight")}
      </div>
    ),
    size: 120,
  },
  {
    id: "actions",
    header: "",
    cell: ActionsCell,
    size: 100,
  },
];

export const carColumns: ColumnDef<Car>[] = [
  {
    accessorKey: "brand",
    header: "Vehicle",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.brand}{" "}
        <span className="text-muted-foreground font-normal">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize font-normal text-muted-foreground"
      >
        {row.getValue("type")}
      </Badge>
    ),
    size: 100,
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <div className="text-muted-foreground tabular-nums">
        {row.getValue("capacity")} Seats
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "pricePerDay",
    header: "Price/Day",
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground">
        ${row.getValue("pricePerDay")}
      </div>
    ),
    size: 120,
  },
  {
    id: "actions",
    header: "",
    cell: ActionsCell,
    size: 100,
  },
];

export const guideColumns: ColumnDef<Guide>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "languages",
    header: "Languages",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {(row.getValue("languages") as string[]).slice(0, 2).map((lang) => (
          <Badge
            key={lang}
            variant="secondary"
            className="font-normal text-xs px-1.5 py-0 h-5"
          >
            {lang}
          </Badge>
        ))}
        {(row.getValue("languages") as string[]).length > 2 && (
          <span className="text-xs text-muted-foreground self-center">
            +{(row.getValue("languages") as string[]).length - 2}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => (
      <div className="text-muted-foreground tabular-nums">
        {row.getValue("experience")} Years
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "pricePerDay",
    header: "Price/Day",
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground">
        ${row.getValue("pricePerDay")}
      </div>
    ),
    size: 120,
  },
  {
    id: "actions",
    header: "",
    cell: ActionsCell,
    size: 100,
  },
];

export const flightColumns: ColumnDef<Flight>[] = [
  {
    accessorFn: (row) => `${row.airline} ${row.flightNumber}`,
    id: "flight",
    header: "Flight",
    cell: ({ row }) => (
      <div className="font-mono font-medium text-muted-foreground">
        {row.getValue("flight")}
      </div>
    ),
    size: 100,
  },
  {
    id: "route",
    header: "Route",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-medium">{row.original.departureAirport}</span>
        <span className="text-muted-foreground opacity-50">→</span>
        <span className="font-medium">{row.original.arrivalAirport}</span>
      </div>
    ),
  },
  {
    accessorKey: "departureTime",
    header: "Time",
    cell: ({ row }) => (
      <div className="tabular-nums text-muted-foreground">
        {new Date(row.getValue("departureTime")).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground/80">
        ${row.getValue("price")}
      </div>
    ),
    size: 100,
  },
  {
    id: "actions",
    header: "",
    cell: ActionsCell,
    size: 100,
  },
];
