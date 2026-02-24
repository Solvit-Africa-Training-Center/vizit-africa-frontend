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
    <div className="px-8 py-6 border-b bg-linear-to-r from-primary/5 to-transparent shrink-0">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Quick Trip Request
          </DialogTitle>
          <DialogDescription className="text-sm">
            Fast booking for your Kigali adventure
          </DialogDescription>
        </div>
        <div className="flex flex-col items-end gap-3 mr-5">
          <div className="flex items-center gap-3">
            {nights > 0 && (
              <Badge variant="secondary" className="font-mono">
                {nights} {nights === 1 ? "night" : "nights"}
              </Badge>
            )}
            {totalGuests > 0 && (
              <Badge variant="outline" className="gap-1">
                <RiUser2Line className="size-3" />
                {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
              </Badge>
            )}
            {itemsCount > 0 && (
              <Badge className="gap-1 bg-primary/90">
                <RiSuitcaseLine className="size-3" />
                {itemsCount} item{itemsCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          {itemsCount > 0 && (
            <p className="text-xs text-muted-foreground text-right max-w-sm">
              {selectedItemsDisplay}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
