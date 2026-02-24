import React, { useState } from "react";
import { RiEditLine, RiSaveLine, RiCloseLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type QuoteBreakdown } from "@/lib/utils/quote-calculator";
import { formatCurrency } from "@/lib/utils/quote-calculator";

interface QuoteSummaryPanelProps {
  breakdown: QuoteBreakdown;
  itemCount: number;
  onPreview: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function QuoteSummaryPanel({
  breakdown,
  itemCount,
  onPreview,
  isLoading = false,
  isDisabled = false,
}: QuoteSummaryPanelProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const [metadata, setMetadata] = useState({
    notes: "",
    currency: "USD",
    expiresIn: 7,
  });

  const handleMetadataChange = (key: string, value: any) => {
    setMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const serviceTypes = Object.entries(breakdown.itemsByType);

  return (
    <div className="sticky top-36 bg-card border border-border rounded-lg overflow-hidden shadow-sm max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="bg-muted/50 border-b border-border p-4">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
          Quote Summary
        </h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Item Count */}
        <div className="flex justify-between items-center pb-3 border-b border-border">
          <span className="text-sm text-muted-foreground">Items</span>
          <span className="font-medium">{itemCount}</span>
        </div>

        {/* Breakdown by Service Type */}
        {serviceTypes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">
              Breakdown
            </h4>
            <div className="space-y-1">
              {serviceTypes.map(([type, data]) => (
                <div
                  key={type}
                  className="flex justify-between text-xs bg-muted/30 rounded p-2"
                >
                  <span className="capitalize">
                    {type} ({data.count})
                  </span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(data.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculations */}
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono font-medium">
              {formatCurrency(breakdown.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (18%)</span>
            <span className="font-mono font-medium">
              {formatCurrency(breakdown.tax)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Fee (5%)</span>
            <span className="font-mono font-medium">
              {formatCurrency(breakdown.serviceFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(breakdown.total)}
            </span>
          </div>
        </div>

        {/* Metadata Toggle */}
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="w-full flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <RiEditLine className="size-4" />
            Quote Settings
          </span>
          <span className="text-xs text-muted-foreground">
            {showMetadata ? "Hide" : "Show"}
          </span>
        </button>

        {/* Metadata Editor */}
        {showMetadata && (
          <div className="space-y-3 p-3 bg-muted/20 rounded border border-border">
            <div>
              <Label htmlFor="currency" className="text-xs">
                Currency
              </Label>
              <select
                id="currency"
                value={metadata.currency}
                onChange={(e) =>
                  handleMetadataChange("currency", e.target.value)
                }
                className="w-full mt-1 px-2 py-1 text-xs rounded border border-input bg-background"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="RWF">RWF (₣)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="expiresIn" className="text-xs">
                Quote Expires In (days)
              </Label>
              <Input
                id="expiresIn"
                type="number"
                min="1"
                max="365"
                value={metadata.expiresIn}
                onChange={(e) =>
                  handleMetadataChange("expiresIn", parseInt(e.target.value))
                }
                className="mt-1 text-xs h-8"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-xs">
                Internal Notes
              </Label>
              <textarea
                id="notes"
                value={metadata.notes}
                onChange={(e) => handleMetadataChange("notes", e.target.value)}
                className="w-full mt-1 px-2 py-1 text-xs rounded border border-input bg-background min-h-16"
                placeholder="Add notes for this quote..."
              />
            </div>
          </div>
        )}

        {/* Preview Button */}
        <Button
          onClick={onPreview}
          disabled={isLoading || isDisabled}
          size="lg"
          className="w-full"
          title={
            isDisabled
              ? "Fix validation errors or add items before reviewing"
              : ""
          }
        >
          {isLoading ? "Sending..." : "Review & Send Quote"}
        </Button>
      </div>
    </div>
  );
}
