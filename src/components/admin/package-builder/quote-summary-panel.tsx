import React from "react";
import { Button } from "@/components/ui/button";
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
  const serviceTypes = Object.entries(breakdown.itemsByType);

  return (
    <div className="sticky top-36 bg-card border border-border rounded-lg overflow-hidden shadow-sm max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="bg-muted/50 border-b border-border p-4">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
          Quote Summary
        </h3>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-border">
          <span className="text-sm text-muted-foreground">Items</span>
          <span className="font-medium">{itemCount}</span>
        </div>

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
