"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Booking } from "@/types";
import { sendQuoteForBooking, notifyVendor } from "@/actions/bookings";
import { toast } from "sonner";

type RequestedItem = {
  id?: string;
  service?: string;
  type?: string;
  category?: string;
  title?: string;
  description?: string;
  price?: number;
  quantity?: number;
  start_date?: string;
  end_date?: string;
};

type QuoteItem = {
  id?: string;
  service?: string;
  type?: string;
  title?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  line_total?: number;
};

const GROUPS = ["flight", "hotel", "car", "guide", "other"] as const;

type GroupKey = (typeof GROUPS)[number];

function normalizeType(type?: string): GroupKey | "other" {
  const value = (type || "").toLowerCase();
  if (value === "flight") return "flight";
  if (value === "hotel" || value === "accommodation") return "hotel";
  if (value === "car" || value === "car_rental" || value === "transport")
    return "car";
  if (value === "guide" || value === "experience" || value === "tour")
    return "guide";
  if (value === "service") return "other";
  return "other";
}

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

interface PackageBuilderClientProps {
  request: Booking;
}

export function PackageBuilderClient({ request }: PackageBuilderClientProps) {
  const t = useTranslations("Admin.packages");

  // Deduplicate and merge requested vs quoted items
  const combinedItems = useMemo(() => {
    const requested = (request.requestedItems || []) as RequestedItem[];
    const quoted = (request.quote?.items || []) as QuoteItem[];

    // Map by ID or Title to deduplicate
    const map = new Map<
      string,
      RequestedItem & { isQuoted?: boolean; quotePrice?: number }
    >();

    requested.forEach((item) => {
      const key = item.id || item.service || item.title || "";
      if (key) map.set(key, { ...item });
    });

    quoted.forEach((item) => {
      const key = item.id || item.service || item.title || "";
      if (key) {
        const existing = map.get(key) || {};
        map.set(key, {
          ...existing,
          ...item,
          isQuoted: true,
          quotePrice: item.unit_price,
          // Prefer quote details if available
          title: item.title || existing.title,
          description: item.description || existing.description,
        });
      }
    });

    return Array.from(map.values());
  }, [request]);

  const [displayItems, setDisplayItems] = useState(combinedItems);
  const [isSending, setIsSending] = useState(false);
  const [notifying, setNotifying] = useState<string | null>(null);

  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    displayItems.forEach((item, index) => {
      const key = item.id || `item-${index}`;
      // Use quote price if available, else requested price, else 0
      map[key] = Number((item as any).quotePrice ?? item.price ?? 0);
    });
    return map;
  });

  const grouped = useMemo(() => {
    const map: Record<GroupKey, (RequestedItem & { isQuoted?: boolean })[]> = {
      flight: [],
      hotel: [],
      car: [],
      guide: [],
      other: [],
    };

    displayItems.forEach((item) => {
      let group = normalizeType(item.type);
      // Fallback categorization based on title or category field
      if (group === "other") {
        const category = String(item.category || "").toLowerCase();
        const title = String(item.title || "").toLowerCase();

        if (category.includes("flight") || title.includes("flight"))
          group = "flight";
        else if (
          category.includes("hotel") ||
          category.includes("bnb") ||
          title.includes("hotel")
        )
          group = "hotel";
        else if (category.includes("car") || title.includes("car"))
          group = "car";
        else if (category.includes("guide") || title.includes("tour"))
          group = "guide";
      }
      map[group].push(item);
    });
    return map;
  }, [displayItems]);

  const sectionTotal = (items: typeof displayItems) =>
    items.reduce((sum, item, index) => {
      const quantity = Number(item.quantity || 1);
      const key = item.id || `item-${index}`;
      return sum + (prices[key] || 0) * quantity;
    }, 0);

  const total = GROUPS.reduce(
    (sum, key) => sum + sectionTotal(grouped[key]),
    0,
  );

  const handleSendQuote = async () => {
    setIsSending(true);
    const quotePayloadItems = displayItems.map((item, index) => {
      const key = item.id || `item-${index}`;
      return {
        id: item.id,
        service: item.service,
        type: item.type,
        title: item.title,
        description: item.description,
        quantity: Number(item.quantity || 1),
        unit_price: prices[key] || 0,
      };
    });

    const result = await sendQuoteForBooking(
      String(request.id),
      quotePayloadItems,
    );
    setIsSending(false);

    if (result.success) {
      toast.success("Quote sent to client successfully");
      return;
    }

    toast.error(result.error || "Failed to send quote");
  };

  const handleNotifyVendor = async (item: RequestedItem) => {
    const itemId = item.id;
    // Use service ID or fallback to ID if it looks like a service ID?
    // Ideally we have a clear service ID.
    const serviceId =
      item.service ||
      (itemId && !itemId.startsWith("item-") ? itemId : undefined);

    if (!serviceId && !itemId) {
      toast.error("Cannot notify vendor: Missing Service ID");
      return;
    }

    setNotifying(itemId || "unknown");

    const result = await notifyVendor(String(request.id), itemId, serviceId, {
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      date: item.start_date,
    });

    setNotifying(null);

    if (result.success) {
      toast.success("Inquiry sent to vendor!");
    } else {
      toast.error(result.error);
    }
  };

  const renderSection = (
    group: GroupKey,
    label: string,
    icon: React.ReactNode,
    emptyLabel: string,
  ) => {
    const items = grouped[group];

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div
              className={`size-8 rounded flex items-center justify-center ${items.length > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              {icon}
            </div>
            <h3 className="font-semibold text-foreground">{label}</h3>
          </div>
          {items.length > 0 && (
            <p className="font-mono text-sm font-medium">
              ${sectionTotal(items).toFixed(2)}
            </p>
          )}
        </div>

        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground text-sm">{emptyLabel}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-primary"
                onClick={() => {
                  const newItem = {
                    id: `new-${Date.now()}`,
                    type: group,
                    title: `New ${label}`,
                    description: "",
                    quantity: 1,
                    price: 0,
                  };
                  setDisplayItems([...displayItems, newItem]);
                  toast.success(`New ${group} item added`);
                }}
              >
                <RiAddLine className="size-4 mr-1" /> Add {label}
              </Button>
            </div>
          ) : (
            items.map((item, index) => {
              const key = item.id || `item-${index}`;
              const quantity = Number(item.quantity || 1);
              const isQuoted = (item as any).isQuoted;
              const isNew = (item as any).id?.startsWith("new-");

              return (
                <div
                  key={key}
                  className="flex flex-col gap-4 p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground text-lg">
                          {item.title || "Service"}
                        </h4>
                        {isQuoted && (
                          <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Quoted
                          </span>
                        )}
                        {isNew && (
                          <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description || "Requested service"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded">
                          Qty: {quantity}
                        </span>
                        {item.start_date && (
                          <span>
                            {item.start_date}{" "}
                            {item.end_date ? `to ${item.end_date}` : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 border-dashed"
                        onClick={() => handleNotifyVendor(item)}
                        disabled={notifying === item.id}
                      >
                        {notifying === item.id ? (
                          <span className="animate-spin mr-2">⟳</span>
                        ) : (
                          <RiMailSendLine className="size-4 mr-2 text-muted-foreground" />
                        )}
                        Check Avail.
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">
                      Unit Price:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={prices[key] ?? 0}
                        onChange={(event) =>
                          setPrices((prev) => ({
                            ...prev,
                            [key]: toNumber(event.target.value),
                          }))
                        }
                        className="w-28 h-9 text-right font-mono"
                      />
                    </div>
                    <span className="font-mono font-semibold w-24 text-right text-lg">
                      ${(quantity * (prices[key] || 0)).toFixed(2)}
                    </span>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                        >
                          <RiDeleteBinLine className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Item?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this item from the
                            package? This action cannot be undone if you save.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                              setDisplayItems((d) =>
                                d.filter(
                                  (i) => (i.id || `item-${index}`) !== key,
                                ),
                              );
                              toast.info("Item removed from package");
                            }}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8 min-h-screen pb-24">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md pb-4 pt-4 mb-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/requests"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <RiArrowLeftLine className="size-4" />
              Back to Requests
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground flex items-center gap-3">
              {t("createTitle")}{" "}
              <span className="text-muted-foreground font-normal text-lg">
                for {request.name}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Quote Value
              </span>
              <span className="font-mono text-2xl font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isSending || displayItems.length === 0}
                  size="lg"
                  className="shadow-lg shadow-primary/20"
                >
                  {isSending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <RiCheckLine className="size-5 mr-2" />
                      {t("actions.sendQuote")}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Send Quote to Client?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will send an email to <strong>{request.email}</strong>{" "}
                    with a link to view and accept this quote. The total value
                    is <strong>${total.toFixed(2)}</strong>.
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

      <div className="mb-6">
        <Alert>
          <RiInformationLine className="size-4" />
          <AlertTitle>Package Builder Tips</AlertTitle>
          <AlertDescription>
            Use the <strong>Check Avail.</strong> button to email vendors
            directly about specific items. Adjust prices and quantities before
            sending the final quote.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-5 sticky top-36 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4 border-b border-border pb-2">
              Request Details
            </h2>

            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Customer
                  </p>
                  <p className="font-medium text-foreground text-base">
                    {request.name}
                  </p>
                  <p className="text-muted-foreground">{request.email}</p>
                  <p className="text-muted-foreground">{request.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Dates
                  </p>
                  <p className="font-medium text-foreground">
                    {request.arrivalDate} <br />↓<br /> {request.departureDate}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  Travelers
                </p>
                <p className="font-medium text-foreground text-lg">
                  {request.travelers} people
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                  Requests
                </p>
                <div className="flex flex-wrap gap-2">
                  {request.needsFlights && (
                    <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded border border-blue-500/20 font-medium">
                      Flights
                    </span>
                  )}
                  {request.needsHotel && (
                    <span className="text-xs bg-purple-500/10 text-purple-600 px-2 py-1 rounded border border-purple-500/20 font-medium">
                      Hotels
                    </span>
                  )}
                  {request.needsCar && (
                    <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded border border-orange-500/20 font-medium">
                      Car Items
                    </span>
                  )}
                  {request.needsGuide && (
                    <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded border border-green-500/20 font-medium">
                      Guide
                    </span>
                  )}
                </div>
              </div>

              {request.notes && (
                <div className="bg-muted/50 p-3 rounded-md border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Notes from Customer
                  </p>
                  <p className="text-foreground italic">"{request.notes}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {renderSection(
            "flight",
            "Flights Options",
            <RiPlaneLine className="size-5" />,
            "No flights requested.",
          )}
          {renderSection(
            "hotel",
            "Hotels Options",
            <RiBuilding2Line className="size-5" />,
            "No hotels requested.",
          )}
          {renderSection(
            "car",
            "Car Options",
            <RiCarLine className="size-5" />,
            "No cars requested.",
          )}
          {renderSection(
            "guide",
            "Guide Options",
            <RiUserLine className="size-5" />,
            "No guides requested.",
          )}

          {renderSection(
            "other",
            "Other Services",
            <RiUserLine className="size-5" />,
            "No other services requested.",
          )}
        </div>
      </div>
    </div>
  );
}
