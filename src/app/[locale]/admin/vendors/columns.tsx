"use client";

import { useState } from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  RiMore2Line,
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiDeleteBinLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteVendor, approveVendor } from "@/actions/vendors";
import type { VendorResponse } from "@/lib/schema/vendor-schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
// import { VendorDetailsSheet } from "@/components/admin/vendor-details-sheet"; // Will create this next

const ActionsCell = ({ row }: { row: Row<VendorResponse> }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteVendor(row.original.id);
      if (result.success) {
        toast.success("Vendor deleted");
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const result = await approveVendor(row.original.id);
      if (result.success) {
        toast.success("Vendor approved successfully");
      } else {
        toast.error(result.error || "Failed to approve vendor");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
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
              onClick={() => setShowDetails(true)}
              className="cursor-pointer"
            >
              <RiEyeLine className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            {!row.original.is_approved && (
              <DropdownMenuItem
                onClick={handleApprove}
                disabled={isProcessing}
                className="cursor-pointer"
              >
                <RiCheckLine className="mr-2 h-4 w-4" />
                Approve Vendor
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive cursor-pointer"
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* <VendorDetailsSheet
        open={showDetails}
        onOpenChange={setShowDetails}
        vendor={row.original}
      /> */}
    </>
  );
};

import { facetedFilterFn } from "@/lib/utils";

// ...

export const vendorColumns: ColumnDef<VendorResponse>[] = [
  // ...
  {
    accessorKey: "vendor_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize font-normal text-muted-foreground"
      >
        {row.getValue("vendor_type")}
      </Badge>
    ),
    filterFn: facetedFilterFn,
  },
  // ...
];

export const pendingVendorColumns: ColumnDef<VendorResponse>[] = [
  // ...
  {
    accessorKey: "vendor_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize font-normal text-muted-foreground"
      >
        {row.getValue("vendor_type")}
      </Badge>
    ),
    filterFn: facetedFilterFn,
  },
  // ...
];
