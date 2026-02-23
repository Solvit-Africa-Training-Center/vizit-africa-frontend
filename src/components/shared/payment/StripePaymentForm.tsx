'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiErrorWarningLine, RiLoader4Line } from '@remixicon/react';
import { confirmStripePayment } from '@/actions/payments';
import { toast } from 'sonner';

interface StripePaymentFormProps {
  bookingId: string;
  paymentIntentId: string;
  onSuccess: () => void;
  amount: string;
}

export function StripePaymentForm({
  bookingId,
  paymentIntentId,
  onSuccess,
  amount,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    // 1. Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'An error occurred');
      setIsProcessing(false);
      return;
    }

    // 2. Create PaymentMethod
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    });

    if (pmError) {
      setError(pmError.message ?? 'Failed to create payment method');
      setIsProcessing(false);
      return;
    }

    // 3. Confirm with our backend
    try {
      const result = await confirmStripePayment(paymentIntentId, paymentMethod.id);
      
      if (result.success) {
        toast.success('Payment successful!');
        onSuccess();
      } else {
        setError(result.error);
        setIsProcessing(false);
      }
    } catch (err) {
      setError('An unexpected error occurred during confirmation.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <Alert variant="destructive">
          <RiErrorWarningLine className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${amount}`
        )}
      </Button>
    </form>
  );
}
