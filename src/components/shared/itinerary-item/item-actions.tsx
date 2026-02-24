import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";
import { BaseItem } from "./types";

export function ItemActions({
  isEditing,
  onUpdate,
  onRemove,
  onAction,
  actionLabel,
  isActionLoading,
}: {
  isEditing: boolean;
  onUpdate?: (updates: Partial<BaseItem>) => void;
  onRemove?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  isActionLoading?: boolean;
}) {
  return (
    <div className="flex flex-row sm:flex-col justify-end gap-2 sm:border-l border-border/50 sm:pl-4">
      {onUpdate && (
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8 rounded-lg", isEditing && "bg-accent")}
            >
              <RiEditLine className="size-4" />
            </Button>
          }
        />
      )}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          onClick={onRemove}
        >
          <RiDeleteBinLine className="size-4" />
        </Button>
      )}
      {onAction && actionLabel && (
        <Button
          size="sm"
          className="h-8 text-[10px] uppercase font-bold tracking-wider"
          onClick={onAction}
          disabled={isActionLoading}
        >
          {isActionLoading ? "..." : actionLabel}
        </Button>
      )}
    </div>
  );
}
