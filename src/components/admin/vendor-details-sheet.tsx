"use client";

import {
  RiGlobalLine,
  RiMailLine,
  RiMapPinLine,
  RiUserLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { vendorSchema, type VendorResponse } from "@/lib/unified-types";

interface VendorDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: VendorResponse;
}

export function VendorDetailsSheet({
  open,
  onOpenChange,
  vendor,
}: VendorDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-2xl">
                    {vendor.business_name}
                  </SheetTitle>
                  <SheetDescription className="mt-1 flex items-center gap-2">
                    <Badge
                      variant={vendor.is_approved ? "default" : "secondary"}
                    >
                      {vendor.is_approved ? "Active" : "Pending Approval"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {vendor.vendor_type}
                    </Badge>
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-8">
              {/* Contact Information */}
              <section>
                <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Contact Information
                </h3>
                <div className="grid gap-4 rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <RiUserLine className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contact Person</p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.full_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <RiMailLine className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Address</p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.email}
                      </p>
                    </div>
                  </div>

                  {vendor.website && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <RiGlobalLine className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {vendor.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {vendor.address && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <RiMapPinLine className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {vendor.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Account Details */}
              <section>
                <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Account Details
                </h3>
                <div className="rounded-lg border divide-y">
                  <div className="flex justify-between p-4">
                    <span className="text-sm text-muted-foreground">
                      Joined Date
                    </span>
                    <span className="text-sm font-medium">
                      {vendor.created_at
                        ? new Date(vendor.created_at).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between p-4">
                    <span className="text-sm text-muted-foreground">
                      Vendor ID
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">
                      {vendor.id}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
