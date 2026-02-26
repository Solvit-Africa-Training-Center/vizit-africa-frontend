import { Badge } from "@/components/ui/badge";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RiSuitcaseLine, RiUser2Line } from "@remixicon/react";

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
  return (
    <div className="px-7 py-5 border-b border-white/[0.07] bg-surface-cream shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <DialogTitle className="font-display text-2xl font-light text-primary tracking-tight flex items-center gap-2">
            <span className="text-base">✦</span>
            Plan Your Journey
          </DialogTitle>
          <DialogDescription className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground">
            Kigali, Rwanda — Concierge Request
          </DialogDescription>
        </div>

        <div className="flex flex-col items-end gap-2 mr-6">
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {nights > 0 && (
              <Badge variant="outline">
                {nights} {nights === 1 ? "night" : "nights"}
              </Badge>
            )}
            {totalGuests > 0 && (
              <Badge className="bg-primary/15 text-primary border border-primary/20">
                <RiUser2Line />
                {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
              </Badge>
            )}
            {itemsCount > 0 && (
              <span className="font-mono text-xs">
             
                {itemsCount} item{itemsCount !== 1 ? "s" : ""}
              </span>
            
            )} 
          </div>
          {itemsCount > 0 && (
            <p className="font-mono text-[8px] text-white/25 text-right max-w-[240px] uppercase tracking-[0.1em] truncate">
              {selectedItemsDisplay}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
