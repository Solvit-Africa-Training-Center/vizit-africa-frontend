import React, { useMemo, useState } from "react";
import { RiAddLine, RiArrowDownSLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { ItineraryItem } from "@/components/shared/itinerary-item";
import { ValidationBadge } from "./validation-alert-banner";
import { PackageItem } from "@/lib/store/package-store";
import { ServiceGroupKey } from "@/lib/utils";

interface GroupedItemsProps {
  grouped: Record<ServiceGroupKey, PackageItem[]>;
  GROUPS: ServiceGroupKey[];
  openAddDialog: (group: ServiceGroupKey) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<PackageItem>) => void;
  handleNotifyVendor: (item: PackageItem) => void;
  notifying: string | null;
  requestDefaults?: { startDate?: string; endDate?: string };
}

const toNumber = (v: any) => Number(v) || 0;

function getItemValidationStatus(item: PackageItem): {
  errors: number;
  warnings: number;
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const price = toNumber(item.quotePrice ?? item.price ?? 0);
  if (price <= 0) {
    errors.push("Zero price");
  }

  if (!item.date && item.type !== "other" && item.type !== "flight") {
    warnings.push("No date");
  }

  if (
    item.type === "flight" &&
    !item.date &&
    !item.departure &&
    !item.arrival
  ) {
    warnings.push("Missing flight details");
  }

  return { errors: errors.length, warnings: warnings.length };
}

export function GroupedItems({
  grouped,
  GROUPS,
  openAddDialog,
  removeItem,
  updateItem,
  handleNotifyVendor,
  notifying,
  requestDefaults,
}: GroupedItemsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<ServiceGroupKey>>(
    new Set(GROUPS.filter((g) => grouped[g]?.length > 0)),
  );

  const toggleGroup = (group: ServiceGroupKey) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <>
      {GROUPS.map((group: ServiceGroupKey) => {
        const items = grouped[group];
        const label =
          group.charAt(0).toUpperCase() + group.slice(1).replace(/_/g, " ");
        const isExpanded = expandedGroups.has(group);

        // Calculate group summary
        const groupTotal = items.reduce((sum, item) => {
          const price = toNumber(item.quotePrice ?? item.price ?? 0);
          return sum + price;
        }, 0);

        const validation = useMemo(() => {
          let errors = 0;
          let warnings = 0;
          items.forEach((item) => {
            const status = getItemValidationStatus(item);
            errors += status.errors;
            warnings += status.warnings;
          });
          return { errors, warnings };
        }, [items]);

        return (
          <div
            key={group}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            {/* Group Header */}
            <div
              onClick={() => items.length > 0 && toggleGroup(group)}
              className={`p-4 border-b border-border flex justify-between items-center bg-muted/30 ${
                items.length > 0
                  ? "cursor-pointer hover:bg-muted/50 transition-colors"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (items.length > 0) toggleGroup(group);
                  }}
                  className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  {items.length > 0 && (
                    <RiArrowDownSLine className="size-4 text-muted-foreground" />
                  )}
                </button>
                <h3 className="font-semibold truncate">{label}s</h3>
                {items.length > 0 && (
                  <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground shrink-0">
                    <span className="whitespace-nowrap">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </span>
                    {groupTotal > 0 && (
                      <>
                        <span>•</span>
                        <span className="font-mono font-semibold text-foreground">
                          ${groupTotal.toFixed(2)}
                        </span>
                      </>
                    )}
                    {validation.errors > 0 ||
                      (validation.warnings > 0 && (
                        <>
                          <span>•</span>
                          <ValidationBadge
                            errorCount={validation.errors}
                            warningCount={validation.warnings}
                            compact
                          />
                        </>
                      ))}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-primary hover:bg-primary/10 ml-2 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddDialog(group);
                }}
              >
                <RiAddLine className="size-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Group Content */}
            {isExpanded && (
              <div className="p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-md">
                    <p>No {label.toLowerCase()}s added</p>
                    <p className="text-xs mt-1">Click "Add" to create one</p>
                  </div>
                ) : (
                  items.map((item: PackageItem) => {
                    const itemValidation = getItemValidationStatus(item);
                    return (
                      <div key={item.tempId || item.id} className="relative">
                        {(itemValidation.errors > 0 ||
                          itemValidation.warnings > 0) && (
                          <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-r bg-linear-to-b from-warning to-warning/80" />
                        )}
                        <ItineraryItem
                          item={item}
                          defaultValues={requestDefaults}
                          onRemove={() =>
                            removeItem(String(item.id ?? item.tempId))
                          }
                          onUpdate={(updates) =>
                            updateItem(
                              String(item.id ?? item.tempId),
                              updates as Partial<PackageItem>,
                            )
                          }
                          onAction={
                            group !== "flight"
                              ? () => handleNotifyVendor(item)
                              : undefined
                          }
                          actionLabel="Notify Vendor"
                          isActionLoading={
                            notifying === (item.id || item.tempId)
                          }
                        />
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
