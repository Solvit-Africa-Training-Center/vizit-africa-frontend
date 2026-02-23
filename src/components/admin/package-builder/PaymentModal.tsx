"use client";

import { useState, useCallback } from "react";
import {
  RiCloseLine,
  RiCheckLine,
  RiLoaderLine,
  RiErrorWarningLine,
  RiShieldCheckLine,
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  currency: string;
  clientEmail: string;
  onPaymentSuccess: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  bookingId,
  amount,
  currency,
  clientEmail,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [paymentStep, setPaymentStep] = useState<
    "details" | "card" | "processing" | "success" | "error"
  >("details");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardDetails((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setCardDetails((prev) => ({ ...prev, expiryDate: value }));
  };

  const handleProcessPayment = async () => {
    // Validate card details
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      setErrorMessage("Invalid card number");
      setPaymentStep("error");
      return;
    }

    if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
      setErrorMessage("Invalid expiry date");
      setPaymentStep("error");
      return;
    }

    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      setErrorMessage("Invalid CVC");
      setPaymentStep("error");
      return;
    }

    if (!cardDetails.cardName.trim()) {
      setErrorMessage("Cardholder name required");
      setPaymentStep("error");
      return;
    }

    setPaymentStep("processing");
    setIsLoading(true);

    try {
      // In production, this would use Stripe Elements
      // For now, simulating payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate payment success
      setPaymentStep("success");
      toast.success("Payment processed successfully!");

      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Payment processing failed"
      );
      setPaymentStep("error");
      toast.error("Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPaymentStep("details");
    setErrorMessage("");
    setCardDetails({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvc: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiShieldCheckLine className="size-5 text-green-600" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete your booking by processing the payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Summary */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Total Amount
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-primary">
                {currency} {amount.toLocaleString()}
              </p>
              <Badge variant="outline">{currency}</Badge>
            </div>
          </div>

          {/* Payment Details Step */}
          {paymentStep === "details" && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-3">Payment Method</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Pay securely with your credit or debit card
                </p>
                <div className="flex gap-2">
                  {["Visa", "Mastercard", "Amex"].map((card) => (
                    <Badge key={card} variant="outline">
                      {card}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => setPaymentStep("card")}
                className="w-full"
                size="lg"
              >
                Enter Card Details
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Card Entry Step */}
          {paymentStep === "card" && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Cardholder Name
                </Label>
                <Input
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      cardName: e.target.value,
                    }))
                  }
                  className="h-10"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Card Number
                </Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="h-10 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Expiry Date
                  </Label>
                  <Input
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="h-10 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    CVC
                  </Label>
                  <Input
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCardDetails((prev) => ({ ...prev, cvc: val }));
                    }}
                    type="password"
                    maxLength={4}
                    className="h-10 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPaymentStep("details")}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <RiLoaderLine className="size-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RiShieldCheckLine className="size-4 mr-2" />
                      Pay {currency} {amount}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {paymentStep === "processing" && (
            <div className="text-center py-8 space-y-4">
              <RiLoaderLine className="size-12 mx-auto text-primary animate-spin" />
              <p className="font-semibold">Processing your payment...</p>
              <p className="text-sm text-muted-foreground">
                Please don't close this window
              </p>
            </div>
          )}

          {/* Success Step */}
          {paymentStep === "success" && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                <RiCheckLine className="size-8 text-green-600" />
              </div>
              <p className="font-semibold text-lg">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">
                Your booking has been confirmed. Check your email for details.
              </p>
            </div>
          )}

          {/* Error Step */}
          {paymentStep === "error" && (
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <RiErrorWarningLine className="size-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-destructive">
                      Payment Failed
                    </p>
                    <p className="text-sm text-destructive/80 mt-1">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPaymentStep("details")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
