import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { RiTranslate2 } from "@remixicon/react";
import type { BaseItem } from "./types";

export function ItemHeader({ item, type }: { item: BaseItem; type: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {type}
            </span>
            {item.isRoundTrip && (
              <Badge
                variant="outline"
                className="h-4 py-0 text-[8px] bg-blue-50 text-blue-700 border-blue-200 uppercase"
              >
                Round Trip
              </Badge>
            )}
            {item.withDriver && (
              <Badge
                variant="outline"
                className="h-4 py-0 text-[8px] bg-orange-50 text-orange-700 border-orange-200 uppercase"
              >
                With Driver
              </Badge>
            )}
          </div>
          <h4 className="font-display text-lg font-medium leading-tight truncate">
            {item.title}
          </h4>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono font-bold text-sm">
            {formatPrice(Number(item.unitPrice ?? item.price ?? 0))}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 max-w-xl">
            {item.description}
          </p>
        )}
        {type === "guide" && !!item.metadata?.language && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase mt-1">
            <RiTranslate2 className="size-3 text-primary" />
            Guide Language: {String(item.metadata.language)}
          </div>
        )}
      </div>
    </div>
  );
}
