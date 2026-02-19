"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { facetedFilterFn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { Booking } from "@/lib/schema/booking-schema";
import { useTranslations } from "next-intl";

// We need to wrap column definitions in a function or component to use hooks like useTranslations
// But standard react-table columns are usually static.
// A common pattern is to pass translations or use a component for the cell that uses the hook.

const HeaderCell = ({ trKey }: { trKey: string }) => {
  const t = useTranslations("Admin.requests.table");
  return <>{t(trKey)}</>;
};

const ServiceBadges = ({ flights, hotel, car, guide }: any) => {
  const t = useTranslations("Admin.requests.table.badges");
  return (
    <div className="flex flex-wrap gap-1">
      {flights && (
        <Badge variant="secondary" className="text-xs font-normal">
          {t("flights")}
        </Badge>
      )}
      {hotel && (
        <Badge variant="secondary" className="text-xs font-normal">
          {t("hotels")}
        </Badge>
      )}
      {car && (
        <Badge variant="secondary" className="text-xs font-normal">
          {t("car")}
        </Badge>
      )}
      {guide && (
        <Badge variant="secondary" className="text-xs font-normal">
          {t("guide")}
        </Badge>
      )}
    </div>
  );
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  RiMore2Line,
  RiEyeLine,
  RiFileAddLine,
  RiCloseCircleLine,
} from "@remixicon/react";

const ActionCell = ({ id, status }: { id: string; status: string }) => {
  const t = useTranslations("Admin.requests.table");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-8 w-8 p-0" />}
      >
        <span className="sr-only">Open menu</span>
        <RiMore2Line className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            render={
              <Link
                href={`/admin/requests/${id}`}
                className="flex items-center cursor-pointer"
              />
            }
          >
            <RiEyeLine className="mr-2 h-4 w-4" />
            {t("view")} Details
          </DropdownMenuItem>

          {status === "pending" && (
            <DropdownMenuItem
              render={
                <Link
                  href={`/admin/packages/${id}`}
                  className="flex items-center cursor-pointer"
                />
              }
            >
              <RiFileAddLine className="mr-2 h-4 w-4" />
              {t("createPackage")}
            </DropdownMenuItem>
          )}

          {(status === "confirmed" ||
            status === "paid" ||
            status === "completed") && (
            <DropdownMenuItem
              render={
                <Link
                  href={`/admin/bookings/${id}/fulfill`}
                  className="flex items-center cursor-pointer"
                />
              }
            >
              <RiFileAddLine className="mr-2 h-4 w-4" />
              Manage Fulfillment
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
            <RiCloseCircleLine className="mr-2 h-4 w-4" />
            Decline Request
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "name",
    header: () => <HeaderCell trKey="customer" />,
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
    header: () => <HeaderCell trKey="dates" />,
    cell: ({ row }) => {
      const t = useTranslations("Admin.requests.table");
      return (
        <div>
          <div className="text-sm text-foreground">
            {row.original.arrivalDate}
          </div>
          <div className="text-sm text-muted-foreground">
            {t("to")} {row.original.departureDate}
          </div>
        </div>
      );
    },
  },
  {
    id: "services",
    header: () => <HeaderCell trKey="services" />,
    cell: ({ row }) => (
      <ServiceBadges
        flights={row.original.needsFlights}
        hotel={row.original.needsHotel}
        car={row.original.needsCar}
        guide={row.original.needsGuide}
      />
    ),
  },
  {
    accessorKey: "status",
    header: () => <HeaderCell trKey="status" />,
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
    filterFn: facetedFilterFn,
  },
  {
    accessorKey: "createdAt",
    header: () => <HeaderCell trKey="created" />,
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
    header: () => (
      <div className="text-right">
        <HeaderCell trKey="actions" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <ActionCell
          id={row.original.id}
          status={row.original.status as string}
        />
      </div>
    ),
  },
];
