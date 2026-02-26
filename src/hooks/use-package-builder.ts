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
  const bookingId = String(request.id || "");
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
    if (!bookingId) {
      logger.error("usePackageBuilder initialized with missing booking ID", { request });
      return;
    }
    const currentDraft = usePackageStore.getState().drafts[bookingId];
    
    // Only initialize if we don't have a draft already
    if (!currentDraft || currentDraft.length === 0) {
      const bookingItems = (request.items || []) as BookingItem[];
      
      const mappedItems = bookingItems.map((item: BookingItem) => {
        const key = String(item.id);
        const type = normalizeType(item.itemType);

        return {
          ...item,
          type: type as any,
          serviceId: item.serviceId,
          service: item.serviceId, // Alias for legacy components
          tempId: key,
          quantity: item.quantity || 1,
          startDate: item.startDate,
          endDate: item.endDate,
          startTime: item.startTime,
          endTime: item.endTime,
          isRoundTrip: !!item.isRoundTrip,
          withDriver: !!item.withDriver,
          returnDate: item.returnDate,
          returnTime: item.returnTime,
          quotePrice: item.unitPrice,
          price: item.unitPrice,
          isQuoted: request.status !== 'pending'
        } as PackageItem;
      });

      setItems(bookingId, mappedItems);
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
      startDate: newItem.date as string,
      startTime: newItem.time as string,
      endDate: newItem.endDate as string,
      endTime: newItem.endTime as string,
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
      isRoundTrip: (group === "flight" || group === "car") ? false : undefined,
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
        serviceId: String(service.id),
        service: String(service.id),
        title: service.title,
        description: service.description,
        quotePrice: toNumber(service.basePrice),
        quantity: 1,
      }));
    }
  };

  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (displayItems.length === 0) {
      warnings.push("No items added to the quote yet.");
    }

    displayItems.forEach((item, index) => {
      const itemLabel = item.title || `Item ${index + 1}`;
      if (!item.title) {
        errors.push(`Item ${index + 1} is missing a title.`);
      }

      const price = toNumber(item.quotePrice ?? item.unitPrice ?? item.price ?? 0);
      if (price <= 0) {
        errors.push(`"${itemLabel}" has no price set.`);
      }

      if (!item.service && !String(item.id).startsWith("new-")) {
        warnings.push(`"${itemLabel}" is a custom item and not linked to a registered service.`);
      }
    });

    return { errors, warnings };
  }, [displayItems, request]);

  const handleSendQuote = async () => {
    logger.info("Initiating send quote", { 
      bookingId, 
      totalItems: displayItems.length,
      amount: quoteBreakdown.total 
    });

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
      // Map items to clean backend-ready format (camelCase is fine, client will snake_case it)
      const items = displayItems.map((item) => {
        const unitPrice = toNumber(
          item.quotePrice ?? item.unitPrice ?? item.price ?? 0,
        );
        const quantity = toNumber(item.quantity || 1);
        
        return {
          id: String(item.id).startsWith("new-") ? undefined : item.id,
          serviceId: item.serviceId || item.service,
          itemType: normalizeType(item.type as string),
          title: item.title,
          description: item.description,
          startDate: (item.startDate || item.date) as string | undefined,
          endDate: item.endDate as string | undefined,
          startTime: (item.startTime || item.time) as string | undefined,
          endTime: item.endTime as string | undefined,
          isRoundTrip: !!item.isRoundTrip,
          withDriver: !!item.withDriver,
          returnDate: item.returnDate as string | undefined,
          returnTime: item.returnTime as string | undefined,
          quantity: quantity,
          unitPrice: unitPrice,
          subtotal: unitPrice * quantity,
          metadata: item.metadata || {},
        };
      });

      const result = await sendQuoteForBooking(bookingId, quoteBreakdown.total, items);

      if (result.success) {
        logger.info("Quote sent successfully", { bookingId, total: quoteBreakdown.total });
        toast.success("Quote sent to client successfully!");
        clearDraft(bookingId);
        setTimeout(() => {
          window.location.href = "/admin/bookings";
        }, 1500);
      } else {
        const errorMsg = result.error || "Failed to send quote. Please try again.";
        logger.error(`Failed to send quote for booking ${bookingId}: ${errorMsg}`, { 
          bookingId, 
          error: result.error 
        });
        setIsSending(false);
        toast.error(errorMsg);
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
      bookingId,
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
