import { Badge } from "@/components/ui/badge";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RiSuitcaseLine, RiUser2Line } from "@remixicon/react";
import { useTranslations } from "next-intl";

export function DialogHeader({
  nights,
  totalGuests,
  itemsCount,
  selectedItemsDisplay,
}: {
  nights: number;
  totalGuests: number;
  itemsCount: number;
  selectedItemsDisplay: string;
}) {
  const t = useTranslations("PlanTrip.conciergeDialog");

  return (
    <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-white/[0.07] bg-surface-cream shrink-0 pr-12 sm:pr-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-0.5">
          <DialogTitle className="font-display text-xl sm:text-2xl font-light text-primary tracking-tight flex items-center gap-2">
            <span className="text-sm sm:text-base">✦</span>
            {t("title")}
          </DialogTitle>
          <DialogDescription className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-foreground/70">
            {t("subtitle")}
          </DialogDescription>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {nights > 0 && (
              <Badge variant="outline" className="text-[9px] sm:text-xs px-1.5 py-0">
                {nights} {nights === 1 ? "night" : "nights"}
              </Badge>
            )}
            {totalGuests > 0 && (
              <Badge className="bg-primary/15 text-primary border border-primary/20 text-[9px] sm:text-xs px-1.5 py-0 flex items-center gap-1">
                <RiUser2Line className="size-2.5 sm:size-3" />
                {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
              </Badge>
            )}
            {itemsCount > 0 && (
              <span className="font-mono text-[9px] sm:text-xs text-muted-foreground">
                {itemsCount} item{itemsCount !== 1 ? "s" : ""}
              </span>
            )} 
          </div>
          {itemsCount > 0 && (
            <p className="hidden sm:block font-mono text-[8px] text-muted-foreground/60 text-right max-w-[240px] uppercase tracking-[0.1em] truncate">
              {selectedItemsDisplay}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
