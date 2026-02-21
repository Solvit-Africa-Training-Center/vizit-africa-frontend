"use client";

import {
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMore2Line,
} from "@remixicon/react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { approveVendor, deleteVendor } from "@/actions/vendors";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { vendorSchema, type VendorResponse } from "@/lib/unified-types";
import { facetedFilterFn } from "@/lib/utils";

const ActionsCell = ({ row }: { row: Row<VendorResponse> }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteVendor(row.original.id);
      if (result.success) {
        toast.success("Vendor deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete vendor");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveVendor(row.original.id);
      if (result.success) {
        toast.success("Vendor approved successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to approve vendor");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="h-8 w-8 p-0" />}
        >
          <span className="sr-only">Open actions</span>
          <RiMore2Line className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              render={
                <Link
                  href={`/admin/vendors/${row.original.id}/edit`}
                  className="flex items-center cursor-pointer"
                />
              }
            >
              <RiEditLine className="mr-2 h-4 w-4" />
              Edit Vendor
            </DropdownMenuItem>

            {!row.original.is_approved && (
              <DropdownMenuItem
                onClick={handleApprove}
                disabled={isApproving}
                className="cursor-pointer"
              >
                <RiCheckLine className="mr-2 h-4 w-4" />
                Approve Vendor
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <RiDeleteBinLine className="mr-2 h-4 w-4" />
              {row.original.is_approved
                ? "Delete Vendor"
                : "Reject Application"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vendor and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const statusCell = ({ row }: { row: Row<VendorResponse> }) => (
  <Badge variant={row.original.is_approved ? "default" : "secondary"}>
    {row.original.is_approved ? "Active" : "Pending"}
  </Badge>
);

const typeCell = ({ row }: { row: Row<VendorResponse> }) => (
  <Badge
    variant="outline"
    className="capitalize font-normal text-muted-foreground"
  >
    {String(row.getValue("vendor_type")).replace(/_/g, " ")}
  </Badge>
);

const baseVendorColumns: ColumnDef<VendorResponse>[] = [
  {
    accessorKey: "business_name",
    header: "Business",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.original.business_name}
      </div>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Contact",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.full_name}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "vendor_type",
    header: "Type",
    cell: typeCell,
    filterFn: facetedFilterFn,
  },
  {
    accessorKey: "is_approved",
    header: "Status",
    cell: statusCell,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell row={row} />,
    size: 100,
  },
];

export const vendorColumns: ColumnDef<VendorResponse>[] = [
  ...baseVendorColumns,
];
export const pendingVendorColumns: ColumnDef<VendorResponse>[] = [
  ...baseVendorColumns,
];
