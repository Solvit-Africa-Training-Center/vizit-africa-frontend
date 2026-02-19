"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  RiArrowLeftLine,
  RiPlaneLine,
  RiBuilding2Line,
  RiCarLine,
  RiUserLine,
  RiMailSendLine,
  RiCheckLine,
  RiAddLine,
  RiDeleteBinLine,
  RiInformationLine,
  RiEditLine,
  RiSaveLine,
  RiTimeLine,
  RiCalendarLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import { sendQuoteForBooking, notifyVendor } from "@/actions/bookings";
import { getServices } from "@/lib/data-fetching";
import { toast } from "sonner";
import type { Booking, RequestedItem } from "@/lib/schema/booking-schema";
import { usePackageStore, type PackageItem } from "@/lib/store/package-store";

function toNumber(value: any): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

const GROUPS = ["flight", "hotel", "car", "guide", "other"] as const;
type GroupKey = (typeof GROUPS)[number];

function normalizeType(type?: string): GroupKey | "other" {
  const value = (type || "").toLowerCase();
  if (value.includes("flight")) return "flight";
  if (value.includes("hotel") || value.includes("accommodation"))
    return "hotel";
  if (value.includes("car") || value.includes("transport")) return "car";
  if (
    value.includes("guide") ||
    value.includes("tour") ||
    value.includes("activity")
  )
    return "guide";
  return "other";
}

interface PackageBuilderClientProps {
  request: Booking;
}

export function PackageBuilderClient({ request }: PackageBuilderClientProps) {
  const t = useTranslations("Admin.packages");
  const bookingId = String(request.id);

  const {
    drafts,
    addItem,
    updateItem,
    removeItem,
    setItems,
    getItems,
    clearDraft,
  } = usePackageStore();

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
        other: "",
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
    const currentDraft = getItems(bookingId);
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
        map.set(key, { ...item, type, tempId: key });
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
          quotePrice: item.unit_price,
          price: item.unit_price || existing?.price,
          quantity: item.quantity || existing?.quantity,
          type:
            normalizeType(item.type) === "other" && item.title
              ? normalizeType(item.title)
              : normalizeType(item.type),
          // Map backend fields to frontend
          date: item.start_date || existing?.start_date,
          time: item.start_time || existing?.start_time,
        });
      });

      setItems(bookingId, Array.from(map.values()));
    }
  }, [bookingId, request, setItems, getItems]);

  const displayItems = getItems(bookingId);

  const grouped = useMemo(() => {
    const map: Record<GroupKey, PackageItem[]> = {
      flight: [],
      hotel: [],
      car: [],
      guide: [],
      other: [],
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
      item.quotePrice ?? item.unit_price ?? item.price ?? 0,
    );
    return sum + qty * price;
  }, 0);

  const handleAddItem = () => {
    const itemToAdd: PackageItem = {
      ...newItem,
      id: `new-${Date.now()}`,
      tempId: `new-${Date.now()}`,
      type: activeGroup,
      title: newItem.title || "New Item",
      description: newItem.description || "",
      quantity: toNumber(newItem.quantity || 1),
      price: toNumber(newItem.quotePrice || 0),
      quotePrice: toNumber(newItem.quotePrice || 0),
      // Common fields
      date: newItem.date,
      time: newItem.time,
      // Flight details
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
      type: group,
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

  const handleSendQuote = async () => {
    setIsSending(true);
    const quotePayloadItems = displayItems.map((item) => ({
      id: item.id?.startsWith("new-") ? undefined : item.id,
      service: item.service,
      type: item.type,
      title: item.title,
      description: item.description,
      quantity: toNumber(item.quantity || 1),
      unit_price: toNumber(item.quotePrice ?? item.price ?? 0),
      // Map to backend fields
      start_date: item.date,
      start_time: item.time,
      metadata: {
        departure: item.departure,
        departureTime: item.departureTime,
        arrival: item.arrival,
        arrivalTime: item.arrivalTime,
        returnDate: item.returnDate,
        returnTime: item.returnTime,
        isRoundTrip: item.isRoundTrip,
      },
    }));

    const result = await sendQuoteForBooking(
      String(request.id),
      quotePayloadItems,
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
      date: item.date || item.start_date,
      time: item.time || item.start_time,
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
      {/* Sticky Header */}
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
                    <AlertDialogDescription>
                      This will send an email to{" "}
                      <strong>{request.email}</strong> with a link to the quote.
                      Total: <strong>${total.toFixed(2)}</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSendQuote}>
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
        {/* Sidebar: Request Details */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-5 sticky top-36 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4 border-b border-border pb-2">
              Request Details
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Dates
                </p>
                <p className="font-medium">
                  {request.arrivalDate} — {request.departureDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Travelers
                </p>
                <p className="font-medium">{request.travelers} People</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Needs
                </p>
                <div className="flex flex-wrap gap-2">
                  {request.needsFlights && (
                    <span className="badge badge-blue">Flights</span>
                  )}
                  {request.needsHotel && (
                    <span className="badge badge-purple">Hotels</span>
                  )}
                  {request.needsCar && (
                    <span className="badge badge-orange">Car</span>
                  )}
                  {request.needsGuide && (
                    <span className="badge badge-green">Guide</span>
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

        {/* Main Content: Builder */}
        <div className="lg:col-span-2 space-y-8">
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
                      <div
                        key={item.tempId || item.id}
                        className="border border-border rounded-md p-4 bg-background hover:shadow-sm transition-all group"
                      >
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium text-lg leading-tight">
                                {item.title}
                              </div>
                              {item.date && (
                                <span className="flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                  <RiCalendarLine className="size-3" />{" "}
                                  {item.date}
                                  {item.time && (
                                    <>
                                      <RiTimeLine className="size-3 ml-1" />{" "}
                                      {item.time}
                                    </>
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {item.description}
                            </div>

                            {/* Flight Details View */}
                            {group === "flight" &&
                              (item.departure || item.arrival) && (
                                <div className="mt-2 text-xs grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground bg-muted/50 p-2.5 rounded border border-border/50">
                                  {item.departure && (
                                    <div>
                                      <span className="font-semibold block uppercase text-[10px] tracking-wider mb-0.5">
                                        Departure
                                      </span>
                                      {item.departure}{" "}
                                      {item.departureTime && (
                                        <span className="text-primary">
                                          @ {item.departureTime}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {item.arrival && (
                                    <div>
                                      <span className="font-semibold block uppercase text-[10px] tracking-wider mb-0.5">
                                        Arrival
                                      </span>
                                      {item.arrival}{" "}
                                      {item.arrivalTime && (
                                        <span className="text-primary">
                                          @ {item.arrivalTime}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {item.isRoundTrip && item.returnDate && (
                                    <div className="col-span-2 pt-1 border-t border-border/50">
                                      <span className="font-semibold block uppercase text-[10px] tracking-wider mb-0.5 text-blue-600">
                                        Return Details
                                      </span>
                                      {item.returnDate}{" "}
                                      {item.returnTime && (
                                        <span className="text-primary">
                                          @ {item.returnTime}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              onClick={() =>
                                removeItem(bookingId, item.id || item.tempId!)
                              }
                            >
                              <RiDeleteBinLine className="size-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleNotifyVendor(item)}
                            disabled={notifying === (item.id || item.tempId)}
                          >
                            {notifying === (item.id || item.tempId)
                              ? "Notifying..."
                              : "Notify Vendor"}
                          </Button>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs text-muted-foreground">
                                Qty
                              </Label>
                              <Input
                                type="number"
                                className="h-8 w-16 text-right"
                                min={1}
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(
                                    bookingId,
                                    item.id || item.tempId!,
                                    { quantity: toNumber(e.target.value) },
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <Label className="text-xs text-muted-foreground">
                                Price
                              </Label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  className="h-8 w-24 pl-5 text-right font-mono"
                                  min={0}
                                  step={0.01}
                                  value={item.quotePrice ?? item.price ?? 0}
                                  onChange={(e) =>
                                    updateItem(
                                      bookingId,
                                      item.id || item.tempId!,
                                      { quotePrice: toNumber(e.target.value) },
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="font-mono font-bold w-20 text-right">
                              $
                              {(
                                (item.quantity || 1) *
                                (item.quotePrice ?? item.price ?? 0)
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Item Dialog */}
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
                              <div className="flex flex-col">
                                <span>{service.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  ${service.base_price}
                                </span>
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

            {/* Generic Date/Time for all except flights (which have specific ones) */}
            {activeGroup !== "flight" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Date</Label>
                  <Input
                    type="date"
                    value={newItem.date || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Service Time</Label>
                  <Input
                    type="time"
                    value={newItem.time || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, time: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0}
                  value={newItem.quotePrice || 0}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quotePrice: toNumber(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={newItem.quantity || 1}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: toNumber(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Flight Specific Fields */}
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
