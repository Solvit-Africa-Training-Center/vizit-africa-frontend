"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { normalizeServiceType } from "@/lib/utils";
import type { BaseItem, ItineraryItemProps } from "./types";
import { ItemIcon } from "./item-icon";
import { ItemHeader } from "./item-header";
import { ItemSummary } from "./item-summary";
import { ItemActions } from "./item-actions";
import { ItemEditor } from "./item-editor";

export type { BaseItem, ItineraryItemProps } from "./types";

export function ItineraryItem({
  item,
  mode = "view",
  onRemove,
  onUpdate,
  onAction,
  actionLabel,
  isActionLoading,
  defaultValues,
}: ItineraryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const type = normalizeServiceType(item.type || item.itemType);

  // Normalize item keys to support both frontend camelCase and backend snake_case
  const normalizedItem: BaseItem = {
    ...item,
    startDate: (item.startDate || item.start_date) as string | null,
    endDate: (item.endDate || item.end_date) as string | null,
    startTime: (item.startTime || item.start_time) as string | null,
    endTime: (item.endTime || item.end_time) as string | null,
    returnDate: (item.returnDate || item.return_date) as string | null,
    returnTime: (item.returnTime || item.return_time) as string | null,
    isRoundTrip: (item.isRoundTrip ?? item.is_round_trip) as boolean | undefined,
    withDriver: (item.withDriver ?? item.with_driver) as boolean | undefined,
    itemType: (item.itemType || item.item_type || item.type) as string | undefined,
    unitPrice: (item.unitPrice ?? item.unit_price ?? item.price) as string | number | undefined,
  };

  return (
    <Collapsible
      open={isEditing}
      onOpenChange={setIsEditing}
      className="group relative flex flex-col gap-4 bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:border-primary/20 transition-all"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <ItemIcon item={normalizedItem} type={type} />
        
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <ItemHeader item={normalizedItem} type={type} />
          <ItemSummary item={normalizedItem} type={type} defaultValues={defaultValues} />
        </div>

        <ItemActions
          isEditing={isEditing}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onAction={onAction}
          actionLabel={actionLabel}
          isActionLoading={isActionLoading}
        />
      </div>

      {onUpdate && (
        <CollapsibleContent data-slot="collapsible-content">
          <div className="overflow-hidden border-t border-border/50 pt-4">
            <ItemEditor
              item={normalizedItem}
              type={type}
              defaultValues={defaultValues}
              onUpdate={onUpdate}
              onClose={() => setIsEditing(false)}
            />
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
