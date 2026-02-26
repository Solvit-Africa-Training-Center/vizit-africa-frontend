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
import { useTranslations } from "next-intl";

export function VendorRequestsList({
  requests,
}: {
  requests: VendorRequest[];
}) {
  const t = useTranslations("Vendor.requests");
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleCheckAvailability = async (req: VendorRequest) => {
    setCheckingId(String(req.id));
    try {
      const result = await checkVendorServiceAvailability(
        req.serviceId,
        req.startDate,
        req.endDate,
        req.quantity,
      );

      if (result.success) {
        if (result.data.available) {
          toast.success(t("messages.available"));
        } else {
          toast.error(
            t("messages.unavailable", { 
              reason: (result.data.reasons as string[])?.join(", ") || "Capacity full" 
            }),
          );
        }
      } else {
        toast.error(result.error || t("messages.checkError"));
      }
    } catch (error) {
      toast.error(t("messages.unexpectedError"));
    } finally {
      setCheckingId(null);
    }
  };

  const handleConfirm = async (req: VendorRequest) => {
    setConfirmingId(String(req.id));
    try {
      const result = await confirmVendorRequest(req.id);
      if (result.success) {
        toast.success(t("messages.confirmSuccess"));
      } else {
        toast.error(result.error || t("messages.confirmError"));
      }
    } catch (error) {
      toast.error(t("messages.unexpectedError"));
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
        <h3 className="font-display text-xl font-medium uppercase tracking-tight">{t("empty.title")}</h3>
        <p className="text-muted-foreground mt-2 font-light">
          {t("empty.description")}
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
                    title: req.serviceName,
                    type: "service",
                    startDate: req.startDate,
                    endDate: req.endDate,
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
                {checkingId === String(req.id) ? t("actions.verifying") : t("actions.verify")}
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
                {req.status === "confirmed" ? t("actions.confirmed") : t("actions.confirm")}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
