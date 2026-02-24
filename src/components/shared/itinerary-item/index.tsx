"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { normalizeServiceType } from "@/lib/utils";
import type { ItineraryItemProps } from "./types";
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

  return (
    <Collapsible
      open={isEditing}
      onOpenChange={setIsEditing}
      className="group relative flex flex-col gap-4 bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:border-primary/20 transition-all"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <ItemIcon item={item} type={type} />
        
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <ItemHeader item={item} type={type} />
          <ItemSummary item={item} type={type} defaultValues={defaultValues} />
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
              item={item}
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
