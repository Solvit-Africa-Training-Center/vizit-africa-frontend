"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { RiEditLine, RiDeleteBinLine, RiStarFill } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ServiceResponse } from "@/lib/schema/service-schema";
import { useTranslations } from "next-intl";

const ActionsCell = () => (
  <div className="flex justify-end gap-2">
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
    >
      <RiEditLine />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:bg-destructive/10"
    >
      <RiDeleteBinLine />
    </Button>
  </div>
);

const HeaderCell = ({ trKey }: { trKey: string }) => {
  const t = useTranslations("Admin.inventory.columns");
  return <>{t(trKey)}</>;
};

export const hotelColumns: ColumnDef<ServiceResponse>[] = [
  {
    accessorKey: "title",
    header: () => <HeaderCell trKey="name" />,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: () => <HeaderCell trKey="location" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground">{String(row.getValue("location") || "-")}</div>
    ),
  },
  {
    accessorKey: "metadata.rating",
    header: () => <HeaderCell trKey="rating" />,
    cell: ({ row }) => {
        const rating = (row.original.metadata?.rating as number) || 0;
        return (
      <div className="flex items-center gap-1">
        <RiStarFill className="size-3.5 text-orange-400" />
        <span className="font-medium tabular-nums">
          {rating}
        </span>
      </div>
    )},
    size: 100,
  },
  {
    accessorKey: "base_price",
    header: () => <HeaderCell trKey="pricePerNight" />,
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground">
        {row.original.currency} {row.getValue("base_price")}
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

export const carColumns: ColumnDef<ServiceResponse>[] = [
  {
    accessorKey: "metadata.brand",
    header: () => <HeaderCell trKey="vehicle" />,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.metadata?.brand as string}{" "}
        <span className="text-muted-foreground font-normal">
          {row.getValue("title")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "service_type",
    header: () => <HeaderCell trKey="type" />,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize font-normal text-muted-foreground"
      >
        {row.getValue("service_type")}
      </Badge>
    ),
    size: 100,
  },
  {
    accessorKey: "metadata.capacity",
    header: () => <HeaderCell trKey="capacity" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground tabular-nums">
        {(row.original.metadata?.capacity as number || 0)} Seats
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "base_price",
    header: () => <HeaderCell trKey="pricePerDay" />,
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground">
        {row.original.currency} {row.getValue("base_price")}
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

export const guideColumns: ColumnDef<ServiceResponse>[] = [
  {
    accessorKey: "title",
    header: () => <HeaderCell trKey="name" />,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "metadata.languages",
    header: () => <HeaderCell trKey="languages" />,
    cell: ({ row }) => {
      const languages = (row.original.metadata?.languages as string[]) || [];
      return (
      <div className="flex flex-wrap gap-1">
        {languages.slice(0, 2).map((lang) => (
          <Badge
            key={lang}
            variant="secondary"
            className="font-normal text-xs px-1.5 py-0 h-5"
          >
            {lang}
          </Badge>
        ))}
        {languages.length > 2 && (
          <span className="text-xs text-muted-foreground self-center">
            +{languages.length - 2}
          </span>
        )}
      </div>
    )},
  },
  {
    accessorKey: "metadata.experience",
    header: () => <HeaderCell trKey="experience" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground tabular-nums">
        {row.original.metadata?.experience as number || 0} Years
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "base_price",
    header: () => <HeaderCell trKey="pricePerDay" />,
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground">
        {row.original.currency} {row.getValue("base_price")}
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

export const flightColumns: ColumnDef<ServiceResponse>[] = [
  {
    accessorFn: (row) => `${row.metadata?.airline || ''} ${row.metadata?.flightNumber || row.title}`,
    id: "flight",
    header: () => <HeaderCell trKey="flight" />,
    cell: ({ row }) => (
      <div className="font-mono font-medium text-muted-foreground">
        {row.getValue("flight")}
      </div>
    ),
    size: 100,
  },
  {
    id: "route",
    header: () => <HeaderCell trKey="route" />,
    cell: ({ row }) => {
        const dep = row.original.metadata?.departureAirport as string;
        const arr = row.original.metadata?.arrivalAirport as string;
        return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-medium">{dep || '?'}</span>
        <span className="text-muted-foreground opacity-50">→</span>
        <span className="font-medium">{arr || '?'}</span>
      </div>
    )},
  },
  {
    accessorKey: "metadata.departureTime",
    header: () => <HeaderCell trKey="time" />,
    cell: ({ row }) => {
        const time = row.original.metadata?.departureTime as string;
        return (
      <div className="tabular-nums text-muted-foreground">
        {time ? new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) : '-'}
      </div>
    )},
    size: 100,
  },
  {
    accessorKey: "base_price",
    header: () => <HeaderCell trKey="price" />,
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground/80">
        {row.original.currency} {row.getValue("base_price")}
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
