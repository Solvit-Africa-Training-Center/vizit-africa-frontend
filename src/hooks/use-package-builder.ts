"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { notifyVendor, sendQuoteForBooking } from "@/actions/bookings";
import { getServices } from "@/lib/simple-data-fetching";
import { type Booking, type BookingItem } from "@/lib/unified-types";
import { type PackageItem, usePackageStore } from "@/lib/store/package-store";
import { calculateQuoteBreakdown } from "@/lib/utils/quote-calculator";
import { logger } from "@/lib/utils/logger";
import {
  type ServiceGroupKey as GroupKey,
  normalizeServiceType as normalizeType,
} from "@/lib/utils";

const toNumber = (v: any) => Number(v) || 0;
const EMPTY_ARRAY: any[] = [];

export function usePackageBuilder(request: Booking) {
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

        const price = toNumber(item.metadata?.price || item.unit_price || 0);

        map.set(key, {
          ...item,
          type: type as any,
          tempId: key,
          quantity: toNumber(item.quantity || 1),
          date: (item.metadata?.startDate || item.start_date || (item as any).date) as string,
          time: (item.metadata?.startTime || item.start_time || (item as any).time) as string,
          startDate: (item.metadata?.startDate || item.start_date) as string,
          endDate: (item.metadata?.endDate || item.end_date) as string,
          startTime: (item.metadata?.startTime || item.start_time) as string,
          endTime: (item.metadata?.endTime || item.end_time) as string,
          isRoundTrip: !!(item.metadata?.isRoundTrip ?? item.is_round_trip ?? false),
          returnDate: (item.metadata?.returnDate || item.return_date) as string,
          returnTime: (item.metadata?.returnTime || item.return_time) as string,
          withDriver: !!(item.metadata?.withDriver ?? item.with_driver ?? false),
          quotePrice: price,
          price: price,
        } as PackageItem);
      });

      quoted.forEach((item) => {
        const key = item.id || item.service || `quote-${Math.random()}`;
        const existing = map.get(key);
        const unit_price = toNumber(item.unit_price || item.unitPrice || 0);

        map.set(key, {
          ...existing,
          ...item,
          id: key,
          tempId: key,
          isQuoted: true,
          unit_price,
          quotePrice: unit_price,
          price: unit_price || existing?.price,
          quantity: 1,
          type: (normalizeType(item.type) === "other" && item.title
            ? normalizeType(item.title)
            : normalizeType(item.type)) as any,
          date: (item.startDate || existing?.date) as string,
          time: (item.startTime || existing?.time) as string,
          startDate: (item.startDate || existing?.startDate) as string,
          endDate: (item.endDate || existing?.endDate) as string,
          startTime: (item.startTime || existing?.startTime) as string,
          endTime: (item.endTime || existing?.endTime) as string,
          isRoundTrip: item.isRoundTrip ?? item.is_round_trip ?? existing?.isRoundTrip,
          returnDate: (item.returnDate || item.return_date || existing?.returnDate) as string,
          returnTime: (item.returnTime || item.return_time || existing?.returnTime) as string,
          withDriver: !!(item.metadata?.withDriver ?? item.withDriver ?? item.with_driver ?? existing?.withDriver),
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
    const price = toNumber(
      item.quotePrice ?? item.unitPrice ?? item.price ?? 0,
    );
    return sum + price;
  }, 0);

  const handleAddItem = () => {
    const itemToAdd: PackageItem = {
      ...newItem,
      id: `new-${Date.now()}`,
      tempId: `new-${Date.now()}`,
      type: (activeGroup === "other" ? "custom" : activeGroup) as any,
      title: newItem.title || "New Item",
      description: newItem.description || "",
      quantity: 1,
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
    logger.debug("Added item to package", { bookingId, itemToAdd });
    setIsAddDialogOpen(false);
    setNewItem({});
    setSelectedServiceId("");
    toast.success(`${activeGroup} item added`);
  };

  const openAddDialog = (group: GroupKey) => {
    logger.debug("Opening add dialog", { group });
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
      logger.debug("Selected service", { service });
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
    // ... validation logic ...
    return { errors, warnings };
  }, [displayItems, request]);

  const handleSendQuote = async () => {
    logger.info("Initiating send quote", { bookingId, totalItems: displayItems.length });
    if (validation.errors.length > 0) {
      logger.warn("Validation errors blocked quote send", { errors: validation.errors });
      toast.error("Please fix all errors before sending the quote.");
      return;
    }
    if (displayItems.length === 0) {
      toast.error("Add at least one item to the quote before sending.");
      return;
    }
    setIsSending(true);

    try {
      const total = displayItems.reduce((sum, item) => {
        const price = toNumber(
          item.quotePrice ?? item.unitPrice ?? item.price ?? 0,
        );
        return sum + price;
      }, 0);

      const result = await sendQuoteForBooking(String(request.id), total);

      if (result.success) {
        logger.info("Quote sent successfully", { bookingId, total });
        toast.success("Quote sent to client successfully!");
        clearDraft(bookingId);
        setTimeout(() => {
          window.location.href = "/admin/bookings";
        }, 1500);
      } else {
        logger.error("Failed to send quote", { bookingId, error: result.error });
        setIsSending(false);
        toast.error(result.error || "Failed to send quote. Please try again.");
      }
    } catch (error) {
      logger.error("Unexpected error in handleSendQuote", { bookingId, error });
      setIsSending(false);
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMsg);
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

  return {
    bookingId,
    displayItems,
    isSending,
    notifying,
    isAddDialogOpen,
    setIsAddDialogOpen,
    activeGroup,
    newItem,
    setNewItem,
    services,
    selectedServiceId,
    showPreviewModal,
    setShowPreviewModal,
    grouped,
    total,
    validation,
    handleAddItem,
    openAddDialog,
    handleServiceSelect,
    handleSendQuote,
    handleNotifyVendor,
    updateItem: (id: string, updates: Partial<PackageItem>) => updateItem(bookingId, id, updates),
    removeItem: (id: string) => removeItem(bookingId, id),
    clearDraft: () => clearDraft(bookingId),
    quoteBreakdown,
  };
}
