import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiCarLine, RiCloseLine, RiHotelLine, RiPlaneLine, RiSuitcaseLine, RiUserStarLine } from "@remixicon/react";
import type { TripItem } from "@/lib/plan_trip-types";
import { useTranslations } from "next-intl";

export function SelectedServices({ items, removeItem, hasItems }: { items: TripItem[]; removeItem: (id: string) => void; hasItems: boolean }) {
  const t = useTranslations("PlanTrip.conciergeDialog.sections");
  const tCommon = useTranslations("Common");

  const getItemIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return RiHotelLine;
      case "car":
        return RiCarLine;
      case "guide":
        return RiUserStarLine;
      case "flight":
        return RiPlaneLine;
      default:
        return RiSuitcaseLine;
    }
  };

  if (!hasItems) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">
            {t("selected")}
          </h3>
        </div>
        <Badge variant="outline">{items.length} items</Badge>
      </div>
      <div className="rounded-xl border bg-card divide-y">
        {items.map((item) => {
          const Icon = getItemIcon(item.type);
          return (
            <div
              key={item.id}
              className="group p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-accent/50 transition-colors relative pr-10 sm:pr-12"
            >
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {item.description}
                </p>
              </div>
              <div className="text-sm font-semibold tabular-nums">
                ${item.price?.toLocaleString()}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
              >
                <RiCloseLine className="size-4" />
                <span className="sr-only">{tCommon("remove")}</span>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
