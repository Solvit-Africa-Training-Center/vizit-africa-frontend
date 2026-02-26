import React from "react";
import { RiCheckLine, RiAlertLine, RiPrinterLine } from "@remixicon/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type PackageItem } from "@/lib/store/package-store";
import {
  type QuoteBreakdown,
  formatCurrency,
} from "@/lib/utils/quote-calculator";
import { format } from "date-fns";

interface QuotePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  items: PackageItem[];
  breakdown: QuoteBreakdown;
  travelerName: string;
  clientEmail: string;
  warnings?: string[];
}

export function QuotePreviewModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  items,
  breakdown,
  travelerName,
  clientEmail,
  warnings = [],
}: QuotePreviewModalProps) {
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + 7);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] md:w-[85vw] lg:w-[95vw] max-w-5xl! max-h-[90vh] overflow-y-auto custom-scrollbar p-0 gap-0">
        <div className="px-6 py-5 border-b border-border bg-muted/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-display font-medium">
              <RiCheckLine className="size-6 text-green-600" />
              Review Official Quote
            </DialogTitle>
            <DialogDescription className="text-base">
              Please verify all client details, items, and pricing before
              sending.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Details & Items */}
          <div className="lg:col-span-2 space-y-8">
            {warnings.length > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-start gap-4">
                  <RiAlertLine className="size-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                  <div className="text-sm space-y-2 flex-1">
                    <div>
                      <p className="font-semibold text-yellow-700 dark:text-yellow-600">
                        {warnings.length} notice
                        {warnings.length !== 1 ? "s" : ""} to review
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
                        Please review these items before finalizing the quote
                      </p>
                    </div>
                    <ul className="space-y-1 pt-1">
                      {warnings.map((warning, idx) => (
                        <li
                          key={idx}
                          className="text-yellow-700 dark:text-yellow-600 flex items-start gap-2"
                        >
                          <span className="mt-1 opacity-70">→</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 border border-border/60 rounded-xl p-5 bg-card/50">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Client Name
                </span>
                <p className="font-medium text-base truncate pr-2">
                  {travelerName}
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Email Address
                </span>
                <p className="font-medium text-base truncate pr-2">
                  {clientEmail}
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Date Issued
                </span>
                <p className="font-medium text-base">
                  {format(new Date(), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Valid Until
                </span>
                <p className="font-medium text-base text-primary">
                  {format(expiresDate, "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Services & Items ({items.length})
              </h3>
              <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, idx) => (
                  <div
                    key={item.tempId || item.id || idx}
                    className="flex items-start justify-between p-4 bg-muted/40 border border-border/50 rounded-lg text-sm transition-colors hover:bg-muted/60"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-medium text-base mb-1 truncate">
                        {item.title}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {item.quantity || 1} ×{" "}
                        {formatCurrency(item.quotePrice || item.price || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-base tabular-nums">
                        {formatCurrency(
                          (item.quantity || 1) *
                            (item.quotePrice || item.price || 0),
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Pricing & Actions */}
          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-border/50 pt-8 lg:pt-0 lg:pl-8 flex flex-col gap-6">
            <div className="bg-muted/30 border border-border/60 rounded-xl p-6 space-y-5 sticky top-0">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">
                Pricing Summary
              </h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-medium">
                    {formatCurrency(breakdown.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Tax (18%)</span>
                  <span className="font-mono">
                    {formatCurrency(breakdown.tax)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Service Fee (5%)</span>
                  <span className="font-mono">
                    {formatCurrency(breakdown.serviceFee)}
                  </span>
                </div>

                <div className="pt-5 mt-3 border-t border-border">
                  <div className="flex justify-between items-end">
                    <span className="font-semibold uppercase text-xs tracking-wider text-muted-foreground">
                      Amount Due
                    </span>
                    <span className="text-3xl font-bold font-display text-primary tabular-nums tracking-tight">
                      {formatCurrency(breakdown.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-4">
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                size="lg"
                className="w-full text-sm font-semibold uppercase tracking-wider h-14 rounded-xl"
              >
                {isLoading ? "Sending Quote..." : "Send to Client"}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  disabled={isLoading}
                  className="w-full text-xs uppercase tracking-wider h-11 rounded-xl"
                >
                  <RiPrinterLine className="size-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full text-xs uppercase tracking-wider h-11 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
