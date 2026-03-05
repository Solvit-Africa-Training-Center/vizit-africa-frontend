import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RiCarLine, RiCloseLine, RiHotelLine, RiPlaneLine, RiUserStarLine } from "@remixicon/react";
import type { TripItem } from "@/lib/plan_trip-types";
import { useTranslations } from "next-intl";

export function QuickServices({
  items,
  toggleItem,
  removeItem,
}: {
  items: TripItem[];
  toggleItem: (id: string, data: TripItem) => void;
  removeItem: (id: string) => void;
}) {
  const t = useTranslations("PlanTrip.conciergeDialog.sections");
  const tServices = useTranslations("PlanTrip.conciergeDialog.services");
  const itemsCount = items.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("services")}</h3>
        {itemsCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {tServices("selectedCount", { count: itemsCount })}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() =>
            toggleItem("flight-request", {
              id: "flight-request",
              type: "flight",
              title: tServices("flights"),
              description: tServices("flightsDesc"),
              price: 0,
              quantity: 1,
            })
          }
          className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
            items.some((i) => i.id === "flight-request")
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent/30"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
              <RiPlaneLine className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{tServices("flights")}</p>
              <p className="text-xs text-muted-foreground">
                {tServices("flightsDesc")}
              </p>
            </div>
            <Checkbox
              checked={items.some((i) => i.id === "flight-request")}
              onCheckedChange={() => {
                toggleItem("flight-request", {
                  id: "flight-request",
                  type: "flight",
                  title: "Flight Booking",
                  description: "Round-trip flight arrangement",
                  price: 0,
                  quantity: 1,
                });
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div
          onClick={() =>
            toggleItem("hotel-request", {
              id: "hotel-request",
              type: "hotel",
              title: tServices("accommodation"),
              description: tServices("accommodationDesc"),
              price: 0,
              quantity: 1,
            })
          }
          className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
            items.some((i) => i.id === "hotel-request")
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent/30"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center shrink-0">
              <RiHotelLine className="size-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{tServices("accommodation")}</p>
              <p className="text-xs text-muted-foreground">
                {tServices("accommodationDesc")}
              </p>
            </div>
            <Checkbox
              checked={items.some((i) => i.id === "hotel-request")}
              onCheckedChange={() =>
                toggleItem("hotel-request", {
                  id: "hotel-request",
                  type: "hotel",
                  title: "Hotel Accommodation",
                  description: "Quality accommodation",
                  price: 0,
                  quantity: 1,
                })
              }
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div
          onClick={() =>
            toggleItem("car-request", {
              id: "car-request",
              type: "car",
              title: tServices("carRental"),
              description: tServices("carRentalDesc"),
              price: 0,
              quantity: 1,
            })
          }
          className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
            items.some((i) => i.id === "car-request")
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent/30"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
              <RiCarLine className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{tServices("carRental")}</p>
              <p className="text-xs text-muted-foreground">
                {tServices("carRentalDesc")}
              </p>
            </div>
            <Checkbox
              checked={items.some((i) => i.id === "car-request")}
              onCheckedChange={() =>
                toggleItem("car-request", {
                  id: "car-request",
                  type: "car",
                  title: "Car Rental",
                  description: "Vehicle rental service",
                  price: 0,
                  quantity: 1,
                })
              }
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div
          onClick={() =>
            toggleItem("guide-request", {
              id: "guide-request",
              type: "guide",
              title: tServices("localGuide"),
              description: tServices("localGuideDesc"),
              price: 0,
              quantity: 1,
            })
          }
          className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
            items.some((i) => i.id === "guide-request")
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent/30"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center shrink-0">
              <RiUserStarLine className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{tServices("localGuide")}</p>
              <p className="text-xs text-muted-foreground">
                {tServices("localGuideDesc")}
              </p>
            </div>
            <Checkbox
              checked={items.some((i) => i.id === "guide-request")}
              onCheckedChange={() =>
                toggleItem("guide-request", {
                  id: "guide-request",
                  type: "guide",
                  title: "Local Guide",
                  description: "Expert local guide",
                  price: 0,
                  quantity: 1,
                })
              }
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      {itemsCount > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("selected")}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-background rounded-full pl-3 pr-1 py-1 text-xs font-medium border border-border/50"
              >
                <span>{item.title}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-1 transition-colors"
                  title="Remove"
                >
                  <RiCloseLine className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
