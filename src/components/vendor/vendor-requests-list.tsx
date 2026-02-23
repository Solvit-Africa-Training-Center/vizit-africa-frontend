"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  checkVendorServiceAvailability,
  confirmVendorRequest,
} from "@/actions/vendors";
import { Badge } from "@/components/ui/badge";
import { ItineraryItem } from "@/components/shared/itinerary-item";
import { vendorSchema, type VendorRequest } from "@/lib/unified-types";

export function VendorRequestsList({
  requests,
}: {
  requests: VendorRequest[];
}) {
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleCheckAvailability = async (req: VendorRequest) => {
    setCheckingId(String(req.id));
    try {
      const result = await checkVendorServiceAvailability(
        req.service_id,
        req.start_date,
        req.end_date,
        req.quantity,
      );

      if (result.success) {
        if (result.data.available) {
          toast.success("Service is available for these dates!");
        } else {
          toast.error(
            `Unavailable: ${result.data.reasons?.join(", ") || "Capacity full"}`,
          );
        }
      } else {
        toast.error(result.error || "Failed to check availability");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setCheckingId(null);
    }
  };

  const handleConfirm = async (req: VendorRequest) => {
    setConfirmingId(String(req.id));
    try {
      const result = await confirmVendorRequest(req.id);
      if (result.success) {
        toast.success("Booking confirmed successfully!");
      } else {
        toast.error(result.error || "Failed to confirm booking");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setConfirmingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-xl bg-muted/20">
        <p className="text-muted-foreground">
          No pending requests for your services.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <ItineraryItem
          key={String(req.id)}
          item={
            {
              ...req,
              title: req.service_name,
              type: "service",
              startDate: req.start_date,
              endDate: req.end_date,
            } as any
          }
          mode="vendor"
          onAction={() => handleConfirm(req)}
          actionLabel={
            req.status === "confirmed" ? "Confirmed" : "Confirm Booking"
          }
          isActionLoading={confirmingId === String(req.id)}
        />
      ))}
    </div>
  );
}
