import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiAlertLine,
  RiErrorWarningLine,
  RiLoader4Line,
} from "@remixicon/react";
import { formatCurrency } from "@/lib/utils/quote-calculator";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/actions/payments";
import { StripePaymentForm } from "./stripe-payment-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  clientEmail: string;
  travelerName: string;
  bookingId: string;
  onPaymentSuccess: () => void;
}

type PaymentStep = "details" | "card" | "processing" | "success" | "error";

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  currency,
  clientEmail,
  travelerName,
  bookingId,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>("details");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const handleInitializeStripe = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const result = await createPaymentIntent(bookingId);
      if (result.success) {
        setClientSecret(result.data.client_secret);
        setPaymentIntentId(result.data.payment_intent_id);
        setStep("card");
      } else {
        setError(result.error);
        setStep("error");
      }
    } catch {
      setError("Failed to initialize payment system.");
      setStep("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setStep("details");
      setClientSecret(null);
      setPaymentIntentId(null);
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            {step === "details" && "Review payment details"}
            {step === "card" && "Enter your payment information"}
            {step === "processing" && "Processing your payment"}
            {step === "success" && "Payment successful"}
            {step === "error" && "Payment failed"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === "details" && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 border border-border/50 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Traveler
                  </span>
                  <span className="font-medium">{travelerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium text-sm">{clientEmail}</span>
                </div>
                <div className="border-t border-border/50 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(amount, currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  Secure Payment
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInitializeStripe}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <RiLoader4Line className="size-4 animate-spin" />
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "card" && clientSecret && (
            <div className="space-y-4">
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: "stripe" },
                  paymentMethodCreation: "manual",
                }}
              >
                <StripePaymentForm
                  bookingId={bookingId}
                  paymentIntentId={paymentIntentId!}
                  amount={formatCurrency(amount, currency)}
                  onSuccess={() => {
                    setStep("success");
                    setTimeout(() => {
                      onPaymentSuccess();
                      handleClose();
                    }, 2000);
                  }}
                />
              </Elements>

              <Button
                variant="ghost"
                onClick={() => setStep("details")}
                disabled={isProcessing}
                className="w-full text-muted-foreground"
              >
                <RiArrowLeftLine className="size-4 mr-2" />
                Back to details
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-4 py-8 text-center">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-success/20 rounded-full blur-xl" />
                  <RiCheckLine className="size-12 text-accent-success relative" />
                </div>
              </div>
              <div>
                <p className="font-semibold">Payment Successful!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your booking has been confirmed
                </p>
              </div>
              <p className="text-lg font-bold">
                {formatCurrency(amount, currency)}
              </p>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-4">
              <div className="text-center py-6 space-y-3">
                <div className="flex justify-center">
                  <RiAlertLine className="size-12 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold">Payment Initialization Failed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Unable to set up the payment session
                  </p>
                </div>
              </div>

              <Alert variant="destructive">
                <RiErrorWarningLine className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleInitializeStripe} className="flex-1">
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
