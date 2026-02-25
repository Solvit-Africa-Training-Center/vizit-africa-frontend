import { useState } from "react";
import { RiCloseLine, RiAlertLine, RiCheckLine } from "@remixicon/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { refundPayment } from "@/actions/payments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  currency: string;
  guestName: string;
  onRefundSuccess?: () => void;
}

type RefundReason = "requested_by_customer" | "duplicate" | "fraudulent";

export function RefundModal({
  isOpen,
  onClose,
  bookingId,
  amount,
  currency,
  guestName,
  onRefundSuccess,
}: RefundModalProps) {
  const [step, setStep] = useState<
    "confirm" | "reason" | "processing" | "success" | "error"
  >("confirm");
  const [reason, setReason] = useState<RefundReason>("requested_by_customer");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleInitiateRefund = () => {
    setStep("reason");
  };

  const handleSubmitRefund = async () => {
    setIsProcessing(true);
    setError("");
    setStep("processing");

    try {
      const result = await refundPayment(bookingId, reason);

      if (result.success) {
        setStep("success");
        toast.success("Refund processed successfully!");
        setTimeout(() => {
          onRefundSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError(result.error || "Failed to process refund");
        setStep("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === "confirm" && "Refund Booking"}
            {step === "reason" && "Select Refund Reason"}
            {step === "processing" && "Processing Refund..."}
            {step === "success" && "Refund Successful"}
            {step === "error" && "Refund Failed"}
          </DialogTitle>
          <DialogDescription>
            {step === "confirm" &&
              "This action will refund the payment and cancel the booking."}
            {step === "reason" && "Please select a reason for the refund."}
            {step === "processing" && "Processing your refund request..."}
            {step === "success" &&
              "The refund has been successfully processed."}
            {step === "error" && "There was an error processing the refund."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "confirm" && (
            <>
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex gap-3">
                <RiAlertLine className="size-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm text-warning-foreground">
                  <p className="font-medium mb-1">
                    Warning: This action cannot be undone
                  </p>
                  <p>
                    Refunding will cancel the booking for{" "}
                    <strong>{guestName}</strong> and return{" "}
                    <strong>
                      {currency} {amount.toFixed(2)}
                    </strong>{" "}
                    to their payment method.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleInitiateRefund}>
                  <RiAlertLine className="size-4 mr-2" />
                  Continue with Refund
                </Button>
              </div>
            </>
          )}

          {step === "reason" && (
            <>
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Refund Reason
                </label>
                <Select
                  value={reason}
                  onValueChange={(value) => {
                    if (value) setReason(value as RefundReason);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requested_by_customer">
                      Requested by Customer
                    </SelectItem>
                    <SelectItem value="duplicate">Duplicate Payment</SelectItem>
                    <SelectItem value="fraudulent">Fraudulent</SelectItem>
                  </SelectContent>
                </Select>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setStep("confirm")}>
                  Back
                </Button>
                <Button onClick={handleSubmitRefund} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Process Refund"}
                </Button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">
                Processing refund for booking {bookingId}...
              </p>
            </div>
          )}

          {step === "success" && (
            <>
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex gap-3">
                <RiCheckLine className="size-5 text-success shrink-0 mt-0.5" />
                <div className="text-sm text-success-foreground">
                  <p className="font-medium mb-1">Refund Processed</p>
                  <p>
                    {currency} {amount.toFixed(2)} has been refunded to the
                    original payment method. It may take 5-10 business days to
                    appear.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button onClick={onClose}>Close</Button>
              </div>
            </>
          )}

          {step === "error" && (
            <>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3">
                <RiAlertLine className="size-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-destructive-foreground">
                  <p className="font-medium mb-1">Refund Failed</p>
                  <p>{error}</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setStep("reason")}>
                  Try Again
                </Button>
                <Button onClick={onClose} variant="destructive">
                  <RiCloseLine className="size-4 mr-2" />
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
