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
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Request } from "@/lib/schemas";
import { sendQuoteForBooking } from "@/actions/bookings";
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
  request: Request;
}

export function PackageBuilderClient({ request }: PackageBuilderClientProps) {
  const t = useTranslations("Admin.packages");
  const tCommon = useTranslations("Admin.requests.table.badges");
  const requestedItems = (request.requestedItems || []) as RequestedItem[];
  const quoteItems = ((request as any).quote?.items || []) as QuoteItem[];
  const displayItems: RequestedItem[] =
    requestedItems.length > 0
      ? requestedItems
      : quoteItems.map((item) => ({
          id: item.id,
          service: item.service,
          type: item.type,
          title: item.title,
          description: item.description,
          quantity: item.quantity,
          price: item.unit_price,
        }));
  const [isSending, setIsSending] = useState(false);

  const quotePriceMap = useMemo(() => {
    const map: Record<string, number> = {};
    quoteItems.forEach((item, index) => {
      const keys = [
        item.id,
        item.service,
        item.title ? `title:${item.title.trim().toLowerCase()}` : undefined,
        `quote-${index}`,
      ].filter(Boolean) as string[];
      keys.forEach((k) => {
        map[k] = Number(item.unit_price || 0);
      });
    });
    return map;
  }, [quoteItems]);

  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    displayItems.forEach((item, index) => {
      const fallbackKey = `item-${index}`;
      const titleKey = item.title ? `title:${item.title.trim().toLowerCase()}` : "";
      const fromQuote =
        quotePriceMap[item.id || ""] ??
        quotePriceMap[item.service || ""] ??
        quotePriceMap[titleKey];
      map[item.id || fallbackKey] = Number(fromQuote ?? item.price ?? 0);
    });
    return map;
  });

  const grouped = useMemo(() => {
    const map: Record<GroupKey, RequestedItem[]> = {
      flight: [],
      hotel: [],
      car: [],
      guide: [],
      other: [],
    };

    displayItems.forEach((item) => {
      let group = normalizeType(item.type);
      if (group === "other") {
        const category = String(item.category || "").toLowerCase();
        if (category.includes("flight")) group = "flight";
        else if (category.includes("hotel") || category.includes("bnb"))
          group = "hotel";
        else if (category.includes("car")) group = "car";
        else if (category.includes("guide")) group = "guide";
      }
      map[group].push(item);
    });
    return map;
  }, [displayItems]);

  const sectionTotal = (items: RequestedItem[]) =>
    items.reduce((sum, item, index) => {
      const quantity = Number(item.quantity || 1);
      const key = item.id || `item-${index}`;
      return sum + (prices[key] || 0) * quantity;
    }, 0);

  const total = GROUPS.reduce((sum, key) => sum + sectionTotal(grouped[key]), 0);

  const quotePayloadItems = displayItems.map((item, index) => {
    const key = item.id || `item-${index}`;
    const quantity = Number(item.quantity || 1);
    const unitPrice = prices[key] || 0;
    return {
      id: item.id,
      service: item.service,
      type: item.type,
      title: item.title,
      description: item.description,
      quantity,
      unit_price: unitPrice,
    };
  });

  const handleSendQuote = async () => {
    setIsSending(true);
    const result = await sendQuoteForBooking(String(request.id), quotePayloadItems);
    setIsSending(false);

    if (result.success) {
      toast.success("Quote sent to client successfully");
      return;
    }

    toast.error(result.error || "Failed to send quote");
  };

  const renderSection = (
    group: GroupKey,
    label: string,
    icon: React.ReactNode,
    emptyLabel: string,
  ) => {
    const items = grouped[group];

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded bg-primary-subtle flex items-center justify-center">
              {icon}
            </div>
            <h3 className="font-semibold text-foreground">{label}</h3>
          </div>
          <p className="font-mono text-sm">${sectionTotal(items).toFixed(2)}</p>
        </div>

        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              {emptyLabel}
            </div>
          ) : (
            items.map((item, index) => {
              const key = item.id || `item-${index}`;
              const quantity = Number(item.quantity || 1);

              return (
                <div
                  key={key}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {item.title || "Service"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description || "Requested service"} • Qty: {quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
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
                      className="w-32"
                    />
                    <span className="font-mono font-semibold w-28 text-right">
                      ${(quantity * (prices[key] || 0)).toFixed(2)}
                    </span>
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
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/requests"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <RiArrowLeftLine className="size-4" />
            {t("back")}
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("createTitle")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("subtitle")} {request.name}
          </p>
        </div>
        <Button onClick={handleSendQuote} disabled={isSending || displayItems.length === 0}>
          {isSending ? "Sending..." : t("actions.sendQuote")}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-5 sticky top-28">
            <h2 className="font-semibold text-foreground mb-4">
              {t("details.title")}
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("details.customer")}</p>
                <p className="font-medium text-foreground">{request.name}</p>
                <p className="text-muted-foreground">{request.email}</p>
                {request.phone && (
                  <p className="text-muted-foreground">{request.phone}</p>
                )}
              </div>

              <div>
                <p className="text-muted-foreground">{t("details.dates")}</p>
                <p className="font-medium text-foreground">
                  {request.arrivalDate} → {request.departureDate}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">{t("details.travelers")}</p>
                <p className="font-medium text-foreground">
                  {request.travelers} people
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">{t("details.services")}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {request.needsFlights && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      {tCommon("flights")}
                    </span>
                  )}
                  {request.needsHotel && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      {tCommon("hotels")}
                    </span>
                  )}
                  {request.needsCar && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      {tCommon("car")}
                    </span>
                  )}
                  {request.needsGuide && (
                    <span className="text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded">
                      {tCommon("guide")}
                    </span>
                  )}
                </div>
              </div>

              {request.notes && (
                <div>
                  <p className="text-muted-foreground">{t("details.notes")}</p>
                  <p className="text-foreground">{request.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {renderSection(
            "flight",
            `${tCommon("flights")} ${t("actions.options")}`,
            <RiPlaneLine className="size-4 text-primary" />,
            "No requested flights in this request.",
          )}
          {renderSection(
            "hotel",
            `${tCommon("hotels")} ${t("actions.options")}`,
            <RiBuilding2Line className="size-4 text-primary" />,
            "No requested hotels in this request.",
          )}
          {renderSection(
            "car",
            `${tCommon("car")} ${t("actions.options")}`,
            <RiCarLine className="size-4 text-primary" />,
            "No requested cars in this request.",
          )}
          {renderSection(
            "guide",
            `${tCommon("guide")} ${t("actions.options")}`,
            <RiUserLine className="size-4 text-primary" />,
            "No requested guides in this request.",
          )}
          {grouped.other.length > 0 &&
            renderSection(
              "other",
              "Other Services",
              <RiUserLine className="size-4 text-primary" />,
              "No requested extra services in this request.",
            )}

          <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <p className="font-semibold text-foreground">Package Total</p>
            <p className="font-mono text-xl font-semibold">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
