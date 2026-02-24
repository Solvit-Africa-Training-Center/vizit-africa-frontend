"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { notifyVendor, sendQuoteForBooking } from "@/actions/bookings";
import { RequestDetails } from "./package-builder/RequestDetails";
import { GroupedItems } from "./package-builder/GroupedItems";
import { AddDialog } from "./package-builder/AddDialog";
import { ValidationAlertBanner } from "./package-builder/ValidationAlertBanner";
import { QuoteSummaryPanel } from "./package-builder/QuoteSummaryPanel";
import { QuotePreviewModal } from "./package-builder/QuotePreviewModal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/lib/simple-data-fetching";
import { type Booking, type BookingItem } from "@/lib/unified-types";
import { type PackageItem, usePackageStore } from "@/lib/store/package-store";
import {
  calculateQuoteBreakdown,
  formatCurrency,
} from "@/lib/utils/quote-calculator";
import {
  SERVICE_GROUPS as GROUPS,
  type ServiceGroupKey as GroupKey,
  normalizeServiceType as normalizeType,
} from "@/lib/utils";
import { RiArrowLeftLine } from "@remixicon/react";

const toNumber = (v: any) => Number(v) || 0;
const EMPTY_ARRAY: any[] = [];
const MUTABLE_GROUPS = [...GROUPS] as const;

interface PackageBuilderClientProps {
  request: Booking;
}

export function PackageBuilderClient({ request }: PackageBuilderClientProps) {
  const _t = useTranslations("Admin.packages");
  const bookingId = String(request.id);
  const [isSending, setIsSending] = useState(false);
  const [notifying, setNotifying] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<GroupKey>("other");
  const [newItem, setNewItem] = useState<Partial<PackageItem>>({});
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const displayItems = usePackageStore(
    (state) => state.drafts[bookingId] || EMPTY_ARRAY,
  );
  const addItem = usePackageStore((state) => state.addItem);
  const updateItem = usePackageStore((state) => state.updateItem);
  const removeItem = usePackageStore((state) => state.removeItem);
  const setItems = usePackageStore((state) => state.setItems);
  const clearDraft = usePackageStore((state) => state.clearDraft);

  const { data: servicesData } = useQuery({
    queryKey: ["services", activeGroup],
    queryFn: async () => {
      const catMap: Record<GroupKey, string> = {
        flight: "flight",
        hotel: "hotel",
        car: "car",
        guide: "guide",
        transport: "transport",
        other: "",
        note: "",
      };
      const res = await getServices(
        catMap[activeGroup] === "other" ? undefined : catMap[activeGroup],
      );
      return res || [];
    },
    enabled: isAddDialogOpen,
  });
  const services = servicesData || [];

  useEffect(() => {
    const currentDraft = usePackageStore.getState().drafts[bookingId];
    if (!currentDraft || currentDraft.length === 0) {
      const requested = (request.requestedItems || []) as BookingItem[];
      const quoted = (request.quote?.items || []) as any[];
      const map = new Map<string, PackageItem>();

      requested.forEach((item) => {
        const key = String(item.id || `req-${Math.random()}`);
        const type =
          normalizeType(item.item_type) === "other" && item.title
            ? normalizeType(item.title)
            : normalizeType(item.item_type);
        map.set(key, {
          ...item,
          type: type as any,
          tempId: key,
          quantity: toNumber(item.quantity || 1),
          date: (item.start_date || (item as any).date) as string,
          time: (item.start_time || (item as any).time) as string,
          startDate: item.start_date as string,
          endDate: item.end_date as string,
          startTime: item.start_time as string,
          endTime: item.end_time as string,
          isRoundTrip: item.is_round_trip,
          returnDate: item.return_date as string,
        } as PackageItem);
      });

      quoted.forEach((item) => {
        const key = item.id || item.service || `quote-${Math.random()}`;
        const existing = map.get(key);
        map.set(key, {
          ...existing,
          ...item,
          id: key,
          tempId: key,
          isQuoted: true,
          quotePrice: item.unitPrice,
          price: item.unitPrice || existing?.price,
          quantity: toNumber(item.quantity || existing?.quantity || 1),
          type: (normalizeType(item.type) === "other" && item.title
            ? normalizeType(item.title)
            : normalizeType(item.type)) as any,
          date: (item.startDate || existing?.date) as string,
          time: (item.startTime || existing?.time) as string,
          startDate: (item.startDate || existing?.startDate) as string,
          endDate: (item.endDate || existing?.endDate) as string,
          startTime: (item.startTime || existing?.startTime) as string,
          endTime: (item.endTime || existing?.endTime) as string,
          isRoundTrip: item.isRoundTrip ?? existing?.isRoundTrip,
          returnDate: (item.returnDate || existing?.returnDate) as string,
          returnTime: (item.returnTime || existing?.returnTime) as string,
          withDriver:
            item.metadata?.withDriver ??
            item.withDriver ??
            existing?.withDriver,
          metadata: {
            ...existing?.metadata,
            ...item.metadata,
          },
        });
      });

      setItems(bookingId, Array.from(map.values()));
    }
  }, [bookingId, request, setItems]);

  const grouped = useMemo(() => {
    const map: Record<GroupKey, PackageItem[]> = {
      flight: [],
      hotel: [],
      car: [],
      guide: [],
      transport: [],
      other: [],
      note: [],
    };
    displayItems.forEach((item) => {
      let group = normalizeType(item.type);
      if (group === "other") {
        const title = (item.title || "").toLowerCase();
        if (title.includes("flight")) group = "flight";
        else if (title.includes("hotel")) group = "hotel";
        else if (title.includes("car")) group = "car";
        else if (title.includes("tour") || title.includes("guide"))
          group = "guide";
      }
      map[group].push(item);
    });
    return map;
  }, [displayItems]);

  const total = displayItems.reduce((sum, item) => {
    const qty = toNumber(item.quantity || 1);
    const price = toNumber(
      item.quotePrice ?? item.unitPrice ?? item.price ?? 0,
    );
    return sum + qty * price;
  }, 0);

  const handleAddItem = () => {
    const itemToAdd: PackageItem = {
      ...newItem,
      id: `new-${Date.now()}`,
      tempId: `new-${Date.now()}`,
      type: (activeGroup === "other" ? "custom" : activeGroup) as any,
      title: newItem.title || "New Item",
      description: newItem.description || "",
      quantity: toNumber(newItem.quantity || 1),
      price: toNumber(newItem.quotePrice || 0),
      quotePrice: toNumber(newItem.quotePrice || 0),
      date: newItem.date,
      time: newItem.time,
      startDate: newItem.date,
      startTime: newItem.time,
      endDate: newItem.endDate,
      endTime: newItem.endTime,
      withDriver: newItem.withDriver,
      metadata: {
        ...newItem.metadata,
        withDriver: newItem.withDriver,
      },
      departure: newItem.departure,
      departureTime: newItem.departureTime,
      arrival: newItem.arrival,
      arrivalTime: newItem.arrivalTime,
      returnDate: newItem.returnDate,
      returnTime: newItem.returnTime,
      isRoundTrip: newItem.isRoundTrip,
    };

    addItem(bookingId, itemToAdd);
    setIsAddDialogOpen(false);
    setNewItem({});
    setSelectedServiceId("");
    toast.success(`${activeGroup} item added`);
  };

  const openAddDialog = (group: GroupKey) => {
    setActiveGroup(group);
    setNewItem({
      type: group as any,
      quantity: 1,
      quotePrice: 0,
      isRoundTrip: group === "flight" ? false : undefined,
    });
    setIsAddDialogOpen(true);
  };

  const handleServiceSelect = (val: string) => {
    setSelectedServiceId(val);
    const service = services.find((s) => String(s.id) === val);
    if (service) {
      setNewItem((prev) => ({
        ...prev,
        service: String(service.id),
        title: service.title,
        description: service.description,
        quotePrice: toNumber(service.base_price),
        quantity: 1,
      }));
    }
  };

  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const flightItems = displayItems.filter(
      (i) => normalizeType(i.type) === "flight",
    );

    displayItems.forEach((item) => {
      const price = toNumber(item.quotePrice ?? item.price ?? 0);
      if (price <= 0) {
        errors.push(`"${item.title}" has a zero price.`);
      }
    });

    if (flightItems.length === 0) {
      if (request.needsFlights) {
        warnings.push(
          "No flight items added, but the traveler explicitly requested flights.",
        );
      } else {
        warnings.push(
          "No flight items have been added to this quote. Ensure this is intentional.",
        );
      }
    }

    flightItems.forEach((flight) => {
      if (toNumber(flight.quantity) !== request.travelers) {
        warnings.push(
          `Flight "${flight.title}" quantity (${flight.quantity}) does not match the total number of travelers (${request.travelers}).`,
        );
      }
      if (!flight.date || !flight.departure || !flight.arrival) {
        warnings.push(
          `Flight "${flight.title}" is missing essential details like date, departure, or arrival city.`,
        );
      }
    });

    displayItems.forEach((item) => {
      const type = normalizeType(item.type);
      if (!item.date && type !== "other" && type !== "flight") {
        warnings.push(`"${item.title}" is missing a service date.`);
      }
    });

    return { errors, warnings };
  }, [displayItems, request]);

  const handleSendQuote = async () => {
    if (validation.errors.length > 0) {
      toast.error("Please fix all errors before sending the quote.");
      return;
    }
    if (displayItems.length === 0) {
      toast.error("Add at least one item to the quote before sending.");
      return;
    }
    setIsSending(true);

    try {
      // Calculate total from all items
      const total = displayItems.reduce((sum, item) => {
        const qty = toNumber(item.quantity || 1);
        const price = toNumber(
          item.quotePrice ?? item.unitPrice ?? item.price ?? 0,
        );
        return sum + qty * price;
      }, 0);

      // Call the API with the correct signature
      const result = await sendQuoteForBooking(String(request.id), total);

      if (result.success) {
        toast.success("Quote sent to client successfully!");
        clearDraft(bookingId);
        // Redirect to bookings list after short delay
        setTimeout(() => {
          window.location.href = "/admin/bookings";
        }, 1500);
      } else {
        setIsSending(false);
        toast.error(result.error || "Failed to send quote. Please try again.");
      }
    } catch (error) {
      setIsSending(false);
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMsg);
      console.error("Send quote error:", error);
    }
  };

  const handleNotifyVendor = async (item: PackageItem) => {
    const itemId = item.id;
    const serviceId = item.service;

    if (!serviceId && (!itemId || String(itemId).startsWith("new-"))) {
      toast.error(
        "Save the quote first or select an existing service to notify vendor.",
      );
      return;
    }

    setNotifying(String(itemId) || "unknown");
    const result = await notifyVendor(
      String(request.id),
      String(itemId),
      serviceId ? String(serviceId) : undefined,
      {
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        date: item.date || item.startDate,
        time: item.time || item.startTime,
        endDate: item.endDate,
        endTime: item.endTime,
        isRoundTrip: item.isRoundTrip,
        returnDate: item.returnDate,
        returnTime: item.returnTime,
        metadata: item.metadata,
      },
    );
    setNotifying(null);

    if (result.success) {
      toast.success("Inquiry sent to vendor!");
    } else {
      toast.error(result.error);
    }
  };

  const quoteBreakdown = useMemo(
    () => calculateQuoteBreakdown(displayItems),
    [displayItems],
  );

  return (
    <div className="mx-auto max-w-9xl px-5 md:px-10 py-8 min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 pb-4 pt-4 mb-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <RiArrowLeftLine className="size-4" />
              Back to Bookings
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
              Package Builder
              <span className="text-muted-foreground font-normal text-lg ml-2">
                {request.name}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Quote Value
              </p>
              <p className="font-mono text-2xl font-bold text-primary">
                {formatCurrency(total)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => clearDraft(bookingId)}
                title="Clear all draft items"
              >
                Clear Draft
              </Button>
              <Button
                disabled={isSending || displayItems.length === 0}
                size="lg"
                onClick={handleSendQuote}
              >
                {isSending ? "Sending..." : "Send Quote"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Alert Banner */}
      <ValidationAlertBanner validation={validation} />

      {/* Main Content Grid: Left Sidebar | Items + Dialog | Right Summary */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Request Details */}
        <div className="lg:col-span-1 order-1">
          <RequestDetails request={request} />
        </div>

        {/* Center: Grouped Items */}
        <div className="lg:col-span-2 space-y-8 order-2">
          <GroupedItems
            grouped={grouped}
            GROUPS={Array.from(MUTABLE_GROUPS) as GroupKey[]}
            openAddDialog={openAddDialog}
            removeItem={(id) => removeItem(bookingId, id)}
            updateItem={(id, updates) => updateItem(bookingId, id, updates)}
            handleNotifyVendor={handleNotifyVendor}
            notifying={notifying}
          />
        </div>

        {/* Right Sidebar: Quote Summary Panel */}
        <div className="lg:col-span-1 order-3">
          <QuoteSummaryPanel
            itemCount={displayItems.length}
            breakdown={quoteBreakdown}
            onPreview={() => setShowPreviewModal(true)}
            isLoading={isSending}
            isDisabled={
              validation.errors.length > 0 || displayItems.length === 0
            }
          />
        </div>
      </div>

      {/* Add Item Dialog */}
      <AddDialog
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        activeGroup={activeGroup}
        newItem={newItem}
        setNewItem={setNewItem}
        services={services}
        selectedServiceId={selectedServiceId}
        handleServiceSelect={handleServiceSelect}
        handleAddItem={handleAddItem}
      />

      {/* Quote Preview Modal */}
      <QuotePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onConfirm={async () => {
          setShowPreviewModal(false);
          await handleSendQuote();
        }}
        items={displayItems}
        breakdown={quoteBreakdown}
        travelerName={request.name}
        clientEmail={request.email}
        bookingId={bookingId}
        warnings={validation.warnings}
        isLoading={isSending}
      />
    </div>
  );
}
