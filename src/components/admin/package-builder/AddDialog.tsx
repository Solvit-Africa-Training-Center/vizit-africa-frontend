"use client";

import React, { useState, useMemo } from "react";
import {
  RiAddLine,
  RiSearchLine,
  RiCalendarLine,
  RiCheckLine,
} from "@remixicon/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { type PackageItem } from "@/lib/store/package-store";
import { type ServiceGroupKey } from "@/lib/utils";

interface Service {
  id: number | string;
  title: string;
  description?: string;
  base_price?: number;
  category?: string;
}

interface AddDialogProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  activeGroup: ServiceGroupKey;
  newItem: Partial<PackageItem>;
  setNewItem: (
    item:
      | Partial<PackageItem>
      | ((prev: Partial<PackageItem>) => Partial<PackageItem>),
  ) => void;
  services: Service[];
  selectedServiceId: string;
  handleServiceSelect: (id: string) => void;
  handleAddItem: () => void;
}

export function AddDialog({
  isAddDialogOpen,
  setIsAddDialogOpen,
  activeGroup,
  newItem,
  setNewItem,
  services,
  selectedServiceId,
  handleServiceSelect,
  handleAddItem,
}: AddDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<"select" | "configure">("select");

  const filteredServices = useMemo(() => {
    return services.filter(
      (s) =>
        (s.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [services, searchQuery]);

  const selectedService = services.find(
    (s) => String(s.id) === selectedServiceId,
  );

  const handleNext = () => {
    if (selectedServiceId || newItem.title) {
      setStep("configure");
    }
  };

  const handleBack = () => {
    setStep("select");
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setStep("select");
    setSearchQuery("");
  };

  const handleConfirm = () => {
    handleAddItem();
    handleClose();
  };

  const toNumber = (v: any) => Number(v) || 0;

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add {activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1)}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Select a service or create a custom item"
              : "Configure the item details"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          // SERVICE SELECTION STEP
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Service List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(String(service.id))}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedServiceId === String(service.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                          selectedServiceId === String(service.id)
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground"
                        }`}
                      >
                        {selectedServiceId === String(service.id) && (
                          <RiCheckLine className="size-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {service.title}
                        </h4>
                        {service.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {service.description}
                          </p>
                        )}
                        {service.base_price && (
                          <p className="text-xs font-mono text-primary mt-1">
                            ${service.base_price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {searchQuery ? "No services found" : "No services available"}
                </div>
              )}
            </div>

            {/* Custom Item Option */}
            <div className="border-t border-border pt-4">
              <Label className="text-xs font-semibold mb-3 block">
                Or create a custom item
              </Label>
              <Input
                placeholder="Item title (e.g., 'Luxury Safari Package')"
                value={(newItem.title as string) || ""}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedServiceId && !newItem.title}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          // CONFIGURATION STEP
          <div className="space-y-4">
            {selectedService && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">{selectedService.title}</p>
                {selectedService.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedService.description}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity" className="text-sm">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={toNumber(newItem.quantity) || 1}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    quantity: toNumber(e.target.value) || 1,
                  }))
                }
                className="mt-1"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price" className="text-sm">
                Unit Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={toNumber(newItem.quotePrice) || 0}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    quotePrice: toNumber(e.target.value),
                  }))
                }
                className="mt-1"
              />
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-sm">
                Date
              </Label>
              <div className="relative mt-1">
                <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={(newItem.date as string) || ""}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="pl-9"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm">
                Description
              </Label>
              <textarea
                id="description"
                value={(newItem.description as string) || ""}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1 w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Add notes about this item..."
              />
            </div>

            {/* Type-Specific Fields */}
            {activeGroup === "flight" && (
              <>
                <div>
                  <Label htmlFor="departure" className="text-sm">
                    Departure City
                  </Label>
                  <Input
                    id="departure"
                    value={(newItem.departure as string) || ""}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        departure: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="e.g., New York (JFK)"
                  />
                </div>
                <div>
                  <Label htmlFor="arrival" className="text-sm">
                    Arrival City
                  </Label>
                  <Input
                    id="arrival"
                    value={(newItem.arrival as string) || ""}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        arrival: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="e.g., Kigali (KGL)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="roundTrip"
                    checked={newItem.isRoundTrip || false}
                    onCheckedChange={(checked) =>
                      setNewItem((prev) => ({
                        ...prev,
                        isRoundTrip: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="roundTrip" className="text-sm font-normal">
                    Round trip
                  </Label>
                </div>
              </>
            )}

            {activeGroup === "car" && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="withDriver"
                  checked={newItem.withDriver || false}
                  onCheckedChange={(checked) =>
                    setNewItem((prev) => ({
                      ...prev,
                      withDriver: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="withDriver" className="text-sm font-normal">
                  Include driver
                </Label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>
                <RiAddLine className="size-4 mr-1" />
                Add Item
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
