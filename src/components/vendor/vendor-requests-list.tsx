"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  checkVendorServiceAvailability,
  confirmVendorRequest,
} from "@/actions/vendors";
import { Badge } from "@/components/ui/badge";
import { ItineraryItem } from "@/components/shared/itinerary-item";
import { type VendorRequest } from "@/lib/unified-types";
import { Button } from "@/components/ui/button";
import { RiCalendarCheckLine, RiCheckDoubleLine, RiLoader4Line } from "@remixicon/react";

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
            `Unavailable: ${(result.data.reasons as string[])?.join(", ") || "Capacity full"}`,
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
      <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/10 border-border/50">
        <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <RiCalendarCheckLine className="size-8 text-muted-foreground/40" />
        </div>
        <h3 className="font-display text-xl font-medium uppercase tracking-tight">No Requests</h3>
        <p className="text-muted-foreground mt-2 font-light">
          Your opportunities will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((req) => (
        <div 
          key={String(req.id)} 
          className="group bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:border-primary/20 transition-all duration-500"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
            <div className="flex-1">
              <ItineraryItem
                item={
                  {
                    ...req,
                    title: req.service_name,
                    type: "service",
                    startDate: req.start_date,
                    endDate: req.end_date,
                  } as any
                }
                mode="view"
              />
            </div>
            
            <div className="flex lg:flex-col gap-3 min-w-[200px]">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-11 rounded-xl font-display uppercase tracking-widest text-[10px] font-bold"
                onClick={() => handleCheckAvailability(req)}
                disabled={checkingId === String(req.id)}
              >
                {checkingId === String(req.id) ? (
                  <RiLoader4Line className="size-3.5 animate-spin mr-2" />
                ) : (
                  <RiCalendarCheckLine className="size-3.5 mr-2" />
                )}
                Verify Dates
              </Button>
              
              <Button
                size="sm"
                className="flex-1 h-11 rounded-xl font-display uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/10"
                onClick={() => handleConfirm(req)}
                disabled={confirmingId === String(req.id) || req.status === "confirmed"}
              >
                {confirmingId === String(req.id) ? (
                  <RiLoader4Line className="size-3.5 animate-spin mr-2" />
                ) : req.status === "confirmed" ? (
                  <RiCheckDoubleLine className="size-3.5 mr-2" />
                ) : (
                  <RiCheckDoubleLine className="size-3.5 mr-2" />
                )}
                {req.status === "confirmed" ? "Confirmed" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
