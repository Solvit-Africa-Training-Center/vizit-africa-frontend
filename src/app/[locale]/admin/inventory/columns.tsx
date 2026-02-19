"use client";

import { useState } from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  RiEditLine,
  RiDeleteBinLine,
  RiMore2Line,
  RiSettings3Line,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteService } from "@/actions/services";
import type { ServiceResponse } from "@/lib/schema/service-schema";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ActionsCell = ({ row }: { row: Row<ServiceResponse> }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteService(row.original.id);

      if (result.success) {
        toast.success("Service deleted");
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const editUrl = `/admin/services/${row.original.id}/edit`;

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="hover:bg-muted"
              aria-label="Open actions"
            />
          }
        >
          <RiMore2Line className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2">
              <RiSettings3Line className="size-3.5 opacity-60" />
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <Link href={editUrl} className="flex items-center w-full" />
                }
              >
                <RiEditLine className="mr-2 size-4 opacity-60" />
                Edit Service
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <RiDeleteBinLine className="mr-2 size-4 opacity-60" />
              Delete Service
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service{" "}
              <span className="font-medium text-foreground">
                "{row.original.title}"
              </span>{" "}
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const HeaderCell = ({ trKey }: { trKey: string }) => {
  const t = useTranslations("Admin.inventory.columns");
  return <>{t(trKey)}</>;
};

export const serviceColumns: ColumnDef<ServiceResponse>[] = [
  {
    accessorKey: "title",
    header: () => <HeaderCell trKey="name" />,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "location",
    header: () => <HeaderCell trKey="location" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {String(row.getValue("location") || "-")}
      </div>
    ),
  },
  {
    accessorKey: "base_price",
    header: () => <HeaderCell trKey="price" />,
    cell: ({ row }) => (
      <div className="font-mono tabular-nums text-muted-foreground">
        {row.original.currency} {row.getValue("base_price")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "secondary"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell row={row} />,
    size: 100,
  },
];
