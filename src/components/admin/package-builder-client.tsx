"use client";

import {
  RiAddLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBuilding2Line,
  RiCalendarLine,
  RiCarLine,
  RiCheckboxCircleLine,
  RiDeleteBinLine,
  RiInformationLine,
  RiPlaneLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { notifyVendor, sendQuoteForBooking } from "@/actions/bookings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompleteTrigger,
} from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItineraryItem } from "@/components/shared/itinerary-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/lib/simple-data-fetching";
import { bookingSchema, type Booking, type RequestedItem } from "@/lib/unified-types";
import { type PackageItem, usePackageStore } from "@/lib/store/package-store";
import {
  SERVICE_GROUPS as GROUPS,
  type ServiceGroupKey as GroupKey,
  normalizeServiceType as normalizeType,
  formatPrice,
  formatTime,
} from "@/lib/utils";

const toNumber = (v: any) => Number(v) || 0;
const EMPTY_ARRAY: any[] = [];

interface PackageBuilderClientProps {
  request: Booking;
}

export function PackageBuilderClient({ request }: PackageBuilderClientProps) {
  const _t = useTranslations("Admin.packages");
  const bookingId = String(request.id);

  const displayItems = usePackageStore(
    (state) => state.drafts[bookingId] || EMPTY_ARRAY,
  );
  const addItem = usePackageStore((state) => state.addItem);
  const updateItem = usePackageStore((state) => state.updateItem);
  const removeItem = usePackageStore((state) => state.removeItem);
  const setItems = usePackageStore((state) => state.setItems);
  const clearDraft = usePackageStore((state) => state.clearDraft);

  const [isSending, setIsSending] = useState(false);
  const [notifying, setNotifying] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<GroupKey>("other");
  const [newItem, setNewItem] = useState<Partial<PackageItem>>({});
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

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
      const requested = (request.requestedItems || []) as RequestedItem[];
      const quoted = (request.quote?.items || []) as any[];

      const map = new Map<string, PackageItem>();

      requested.forEach((item) => {
        const key = item.id || `req-${Math.random()}`;
        const type =
          normalizeType(item.type) === "other" && item.title
            ? normalizeType(item.title)
            : normalizeType(item.type);
        map.set(key, {
          ...item,
          type: type as any,
          tempId: key,
          quantity: toNumber(item.quantity || 1),
          date: (item.startDate || (item as any).date) as string,
          time: (item.startTime || (item as any).time) as string,
          startDate: item.startDate as string,
          endDate: item.endDate as string,
          startTime: item.startTime as string,
          endTime: item.endTime as string,
          isRoundTrip: item.isRoundTrip,
          returnDate: item.returnDate as string,
        });
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
    setIsSending(true);
    const quotePayloadItems = displayItems.map((item) => ({
      id: item.id?.startsWith("new-") ? undefined : item.id,
      serviceId: item.service,
      type: item.type as string,
      title: item.title,
      description: item.description,
      quantity: toNumber(item.quantity || 1),
      unitPrice: toNumber(item.quotePrice ?? item.price ?? 0),
      startDate: (item.date || item.startDate) as string,
      startTime: (item.time || item.startTime) as string,
      endDate: item.endDate as string,
      endTime: item.endTime as string,
      isRoundTrip: item.isRoundTrip,
      returnDate: item.returnDate as string,
      returnTime: item.returnTime as string,
      metadata: item.metadata,
    }));

    const result = await sendQuoteForBooking(
      String(request.id),
      quotePayloadItems as any,
    );
    setIsSending(false);

    if (result.success) {
      toast.success("Quote sent to client successfully");
      clearDraft(bookingId);
    } else {
      toast.error(result.error || "Failed to send quote");
    }
  };

  const handleNotifyVendor = async (item: PackageItem) => {
    const itemId = item.id;
    const serviceId = item.service;

    if (!serviceId && (!itemId || itemId.startsWith("new-"))) {
      toast.error(
        "Save the quote first or select an existing service to notify vendor.",
      );
      return;
    }

    setNotifying(itemId || "unknown");
    const result = await notifyVendor(String(request.id), itemId, serviceId, {
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
    });
    setNotifying(null);

    if (result.success) {
      toast.success("Inquiry sent to vendor!");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8 min-h-screen pb-24">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 pt-4 mb-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <RiArrowLeftLine className="size-4" />
              Back to Inventory
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
              Package Builder
              <span className="text-muted-foreground font-normal text-lg">
                for {request.name}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Quote Value
              </p>
              <p className="font-mono text-2xl font-bold text-primary">
                ${total.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => clearDraft(bookingId)}
                title="Clear Draft"
              >
                Clear
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      disabled={isSending || displayItems.length === 0}
                      size="lg"
                    />
                  }
                >
                  {isSending ? "Sending..." : "Send Quote"}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Send Quote to Client?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                      <p>
                        This will send an email to{" "}
                        <strong>{request.email}</strong> with a link to the
                        quote. Total: <strong>${total.toFixed(2)}</strong>.
                      </p>

                      {validation.errors.length > 0 && (
                        <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                          <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-2">
                            Errors (Must be Fixed)
                          </p>
                          <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
                            {validation.errors.map((error, idx) => (
                              <li key={idx}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validation.warnings.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md">
                          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                            Review Warnings
                          </p>
                          <ul className="list-disc list-inside text-sm text-amber-900/80 space-y-1">
                            {validation.warnings.map((warning, idx) => (
                              <li key={idx}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSendQuote}
                      disabled={validation.errors.length > 0}
                    >
                      Send Quote
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-5 sticky top-36 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4 border-b border-border pb-2">
              Request Details
            </h2>
            <div className="space-y-5 text-sm">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Trip Schedule
                </p>
                <div className="space-y-2.5">
                  <div className="flex gap-3">
                    <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <RiCalendarLine className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60">
                        Arrival
                      </p>
                      <p className="font-medium">
                        {request.arrivalDate || "TBD"}
                      </p>
                      {request.arrivalTime && (
                        <p className="text-[10px] text-primary flex items-center gap-1">
                          <RiTimeLine className="size-3" />{" "}
                          {request.arrivalTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <RiArrowRightLine className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60">
                        Departure
                      </p>
                      <p className="font-medium">
                        {request.departureDate || "TBD"}
                      </p>
                      {request.departureTime && (
                        <p className="text-[10px] text-primary flex items-center gap-1">
                          <RiTimeLine className="size-3" />{" "}
                          {request.departureTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {request.isRoundTrip && (
                    <div className="flex gap-3 bg-blue-50/50 p-2 rounded-md border border-blue-100">
                      <div className="size-8 rounded bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                        <RiCalendarLine className="size-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-blue-600">
                          Round Trip Return
                        </p>
                        <p className="font-medium text-blue-900">
                          {request.returnDate || "TBD"}
                        </p>
                        {request.returnTime && (
                          <p className="text-[10px] text-blue-600 flex items-center gap-1">
                            <RiTimeLine className="size-3" />{" "}
                            {request.returnTime}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  Traveler Group
                </p>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <p className="font-bold text-lg leading-tight mb-1">
                    {request.travelers}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      Total
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase font-bold text-primary">
                    <span>{request.adults} Adults</span>
                    {request.children > 0 && (
                      <span>• {request.children} Children</span>
                    )}
                    {request.infants > 0 && (
                      <span className="text-blue-600">
                        • {request.infants} Infants
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Services Requested
                </p>
                <div className="flex flex-wrap gap-2">
                  {request.needsFlights && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      Flights
                    </Badge>
                  )}
                  {request.needsHotel && (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      Hotels
                    </Badge>
                  )}
                  {request.needsCar && (
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200"
                    >
                      Car Rental
                    </Badge>
                  )}
                  {request.needsGuide && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Local Guide
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  Detailed Preferences
                </p>
                <div className="space-y-2.5">
                  {request.preferredCabinClass && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground uppercase">
                        Cabin
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase font-bold py-0 h-4"
                      >
                        {request.preferredCabinClass.replace("_", " ")}
                      </Badge>
                    </div>
                  )}
                  {request.hotelStarRating && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground uppercase">
                        Hotels
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase font-bold py-0 h-4"
                      >
                        {request.hotelStarRating} Stars
                      </Badge>
                    </div>
                  )}
                  {request.carTypePreference && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground uppercase">
                        Vehicle
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase font-bold py-0 h-4"
                      >
                        {request.carTypePreference}
                      </Badge>
                    </div>
                  )}
                  {request.guideLanguages &&
                    request.guideLanguages.length > 0 && (
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground uppercase">
                          Guide
                        </span>
                        <span className="font-medium">
                          {request.guideLanguages.join(", ")}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {request.notes && (
                <div className="bg-muted p-3 rounded text-muted-foreground italic">
                  "{request.notes}"
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {request.requestedItems && request.requestedItems.length > 0 && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
              <h3 className="font-display font-medium text-lg mb-4 flex items-center gap-2 text-primary">
                <RiInformationLine className="size-5" />
                Customer's Initial Selection
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {request.requestedItems.map((req, idx) => {
                  const isAdded = displayItems.some(
                    (item) =>
                      item.service === req.service || item.title === req.title,
                  );
                  return (
                    <div
                      key={req.id || idx}
                      className="bg-background border border-border/50 rounded-lg p-3 flex items-center justify-between group"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                          {req.type}
                        </span>
                        <p className="text-sm font-medium leading-tight">
                          {req.title}
                        </p>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1">
                          {req.startDate && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <RiCalendarLine className="size-2.5" />
                              {req.startDate}
                              {req.startTime && ` at ${req.startTime}`}
                            </span>
                          )}
                          {req.isRoundTrip && req.returnDate && (
                            <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
                              <RiArrowLeftLine className="size-2.5 rotate-180" />
                              Return {req.returnDate}
                            </span>
                          )}
                          {req.quantity && (
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 rounded-full">
                              Qty: {req.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                      {isAdded ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded">
                          <RiCheckboxCircleLine className="size-3" />
                          Already Added
                        </div>
                      ) : (
                        <div className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded">
                          Requested
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {GROUPS.map((group) => {
            const items = grouped[group];
            const label = group.charAt(0).toUpperCase() + group.slice(1);

            return (
              <div
                key={group}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                  <h3 className="font-semibold flex items-center gap-2">
                    {group === "flight" && <RiPlaneLine className="size-5" />}
                    {group === "hotel" && (
                      <RiBuilding2Line className="size-5" />
                    )}
                    {group === "car" && <RiCarLine className="size-5" />}
                    {group === "guide" && <RiUserLine className="size-5" />}
                    {group === "other" && (
                      <RiInformationLine className="size-5" />
                    )}
                    {label}s
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:bg-primary/10"
                    onClick={() => openAddDialog(group)}
                  >
                    <RiAddLine className="size-4 mr-1" /> Add {label}
                  </Button>
                </div>

                <div className="p-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-md">
                      No {label.toLowerCase()}s added.
                    </div>
                  ) : (
                    items.map((item) => (
                      <ItineraryItem
                        key={item.tempId || item.id}
                        item={{
                          ...item,
                          startDate: (item.date || item.startDate) as string,
                          startTime: (item.time || item.startTime) as string,
                          isRoundTrip: item.isRoundTrip,
                          returnDate: item.returnDate as string,
                          returnTime: item.returnTime as string,
                          withDriver: item.withDriver,
                        }}
                        onRemove={() =>
                          removeItem(bookingId, item.id || item.tempId!)
                        }
                        onUpdate={(updates) =>
                          updateItem(bookingId, item.id || item.tempId!, {
                            date: updates.startDate as string,
                            time: updates.startTime as string,
                            startDate: updates.startDate,
                            startTime: updates.startTime,
                            endDate: updates.endDate,
                            endTime: updates.endTime,
                            isRoundTrip: updates.isRoundTrip,
                            returnDate: updates.returnDate,
                            returnTime: updates.returnTime,
                            withDriver: updates.withDriver,
                            metadata: {
                              ...item.metadata,
                              ...updates.metadata,
                            },
                          })
                        }
                        onAction={
                          group !== "flight"
                            ? () => handleNotifyVendor(item)
                            : undefined
                        }
                        actionLabel="Notify Vendor"
                        isActionLoading={notifying === (item.id || item.tempId)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add {activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Select an existing service or create a custom item.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {activeGroup !== "flight" && (
              <div className="space-y-2">
                <Label>Select Existing Service</Label>
                <Autocomplete
                  value={selectedServiceId}
                  onValueChange={handleServiceSelect}
                >
                  <AutocompleteTrigger>
                    <span className="truncate">
                      {services.find((s) => String(s.id) === selectedServiceId)
                        ?.title || "Search services..."}
                    </span>
                  </AutocompleteTrigger>
                  <AutocompletePortal>
                    <AutocompletePositioner>
                      <AutocompletePopup>
                        <AutocompleteInput placeholder="Search..." />
                        <AutocompleteList>
                          {services.map((service) => (
                            <AutocompleteItem
                              key={service.id}
                              value={String(service.id)}
                            >
                              <div className="flex flex-col w-full">
                                <div className="flex justify-between items-start">
                                  <span className="font-medium">
                                    {service.title}
                                  </span>
                                  <span className="text-xs font-mono font-bold">
                                    ${service.base_price}
                                  </span>
                                </div>
                                {service.vendor && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                      {service.vendor.business_name}
                                    </span>
                                    {service.vendor.is_system_user ? (
                                      <Badge
                                        variant="outline"
                                        className="text-[8px] py-0 h-3 bg-emerald-50 text-emerald-700 border-emerald-200"
                                      >
                                        System Active
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-[8px] py-0 h-3 bg-muted text-muted-foreground border-border"
                                      >
                                        Passive
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </AutocompleteItem>
                          ))}
                          {services.length === 0 && (
                            <div className="p-2 text-sm text-muted-foreground">
                              No services found.
                            </div>
                          )}
                        </AutocompleteList>
                      </AutocompletePopup>
                    </AutocompletePositioner>
                  </AutocompletePortal>
                </Autocomplete>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {activeGroup === "flight"
                    ? "Flight Manual Entry"
                    : "Or Custom Details"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Item Title"
                value={newItem.title || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Description..."
                value={newItem.description || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </div>

            {activeGroup !== "flight" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newItem.date || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newItem.time || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                {(activeGroup === "hotel" ||
                  activeGroup === "car" ||
                  activeGroup === "guide") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newItem.endDate || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, endDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={newItem.endTime || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, endTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {activeGroup === "car" && (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="with-driver-add">Private Driver</Label>
                      <p className="text-[10px] text-muted-foreground">
                        Include a professional chauffeur
                      </p>
                    </div>
                    <Switch
                      id="with-driver-add"
                      checked={newItem.withDriver}
                      onCheckedChange={(v) =>
                        setNewItem({ ...newItem, withDriver: v })
                      }
                    />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <NumberField
                  min={0}
                  value={newItem.quotePrice ?? 0}
                  onValueChange={(val) =>
                    setNewItem({
                      ...newItem,
                      quotePrice: val ?? undefined,
                    })
                  }
                >
                  <NumberFieldGroup>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldGroup>
                </NumberField>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <NumberField
                  min={1}
                  value={newItem.quantity ?? 1}
                  onValueChange={(val) =>
                    setNewItem({
                      ...newItem,
                      quantity: val ?? undefined,
                    })
                  }
                >
                  <NumberFieldGroup>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldGroup>
                </NumberField>
              </div>
            </div>

            {activeGroup === "flight" && (
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <RiPlaneLine className="size-4" /> Flight Details
                </h4>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newItem.isRoundTrip}
                    onCheckedChange={(c) =>
                      setNewItem({ ...newItem, isRoundTrip: c })
                    }
                    id="round-trip"
                  />
                  <Label htmlFor="round-trip">Round Trip</Label>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Departure City/Info</Label>
                      <Input
                        placeholder="e.g. JFK"
                        value={newItem.departure || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, departure: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Departure Time</Label>
                      <Input
                        type="time"
                        value={newItem.departureTime || ""}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            departureTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Arrival City/Info</Label>
                      <Input
                        placeholder="e.g. NBO"
                        value={newItem.arrival || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, arrival: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Arrival Time</Label>
                      <Input
                        type="time"
                        value={newItem.arrivalTime || ""}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            arrivalTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Travel Date</Label>
                    <Input
                      type="date"
                      value={newItem.date || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, date: e.target.value })
                      }
                    />
                  </div>
                </div>

                {newItem.isRoundTrip && (
                  <div className="space-y-3 pt-2 border-t border-border/50">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Return Date</Label>
                        <Input
                          type="date"
                          value={newItem.returnDate || ""}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              returnDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Return Time</Label>
                        <Input
                          type="time"
                          value={newItem.returnTime || ""}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              returnTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={!newItem.title}>
              Add to Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
