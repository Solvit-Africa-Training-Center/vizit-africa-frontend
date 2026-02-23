import React, { useState } from "react";
import {
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiPrinterLine,
} from "@remixicon/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type PackageItem } from "@/lib/store/package-store";
import { type QuoteBreakdown } from "@/lib/utils/quote-calculator";
import { formatCurrency } from "@/lib/utils/quote-calculator";
import { format } from "date-fns";
import { PaymentModal } from "@/components/shared/payment";

interface QuotePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  items: PackageItem[];
  breakdown: QuoteBreakdown;
  travelerName: string;
  clientEmail: string;
  bookingId: string;
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
  bookingId,
  warnings = [],
}: QuotePreviewModalProps) {
  const [showPayment, setShowPayment] = useState(false);
  
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + 7);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiCheckLine className="size-5 text-green-600" />
            Review Quote Before Sending
          </DialogTitle>
          <DialogDescription>
            Verify all details are correct before sending to the client
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <RiAlertLine className="size-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                <div className="text-sm space-y-2 flex-1">
                  <div>
                    <p className="font-semibold text-yellow-700 dark:text-yellow-600">
                      {warnings.length} warning
                      {warnings.length !== 1 ? "s" : ""} to review
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
                      These items may need attention before sending
                    </p>
                  </div>
                  <ul className="space-y-1 pt-1">
                    {warnings.map((warning, idx) => (
                      <li
                        key={idx}
                        className="text-yellow-700 dark:text-yellow-600 flex items-start gap-2"
                      >
                        <span className="mt-1">→</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Client Info */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name</span>
                <p className="font-medium">{travelerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="font-mono text-xs break-all">{clientEmail}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Quote Expires</span>
                <p className="font-medium">
                  {format(expiresDate, "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Items</span>
                <p className="font-medium">
                  {items.length} service{items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Quote Items ({items.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item, idx) => (
                <div
                  key={item.tempId || item.id || idx}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity || 1} ×{" "}
                      {formatCurrency(item.quotePrice || item.price || 0)}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {formatCurrency(
                      (item.quantity || 1) *
                        (item.quotePrice || item.price || 0),
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/20">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Pricing
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">
                  {formatCurrency(breakdown.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (18%)</span>
                <span className="font-mono">
                  {formatCurrency(breakdown.tax)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Service Fee (5%)</span>
                <span className="font-mono">
                  {formatCurrency(breakdown.serviceFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border font-bold text-base">
                <span>Total Quote Value</span>
                <span className="text-primary">
                  {formatCurrency(breakdown.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={isLoading || showPayment}>
              <RiCloseLine className="size-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              disabled={isLoading || showPayment}
            >
              <RiPrinterLine className="size-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={() => setShowPayment(true)} 
              disabled={isLoading} 
              size="lg"
            >
              {isLoading ? "Sending..." : "Send Quote to Client"}
            </Button>
          </div>

          {/* Payment Modal */}
          <PaymentModal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            bookingId={bookingId}
            amount={breakdown.total}
            currency="USD"
            clientEmail={clientEmail}
            travelerName={travelerName}
            onPaymentSuccess={() => {
              setShowPayment(false);
              onConfirm();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
