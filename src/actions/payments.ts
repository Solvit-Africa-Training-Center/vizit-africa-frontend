"use server";

import { api, ApiError } from "@/lib/api/simple-client";
import { type ActionResult } from "@/lib/unified-types";
import { endpoints } from "./endpoints";

export async function createPaymentIntent(bookingId: string): Promise<
  ActionResult<{
    client_secret: string;
    payment_intent_id: string;
  }>
> {
  try {
    const data = await api.post<{
      client_secret: string;
      payment_intent_id: string;
    }>(endpoints.payments.stripe.createIntent, { booking_id: bookingId });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError
          ? error.message
          : "Failed to create payment intent",
    };
  }
}

export async function confirmStripePayment(
  paymentIntentId: string,
  paymentMethodId: string,
): Promise<ActionResult<{ status: string }>> {
  try {
    const data = await api.post<{ status: string }>(
      endpoints.payments.stripe.confirm,
      {
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId,
      },
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to confirm payment",
    };
  }
}

export async function refundPayment(
  bookingId: string,
  reason: "requested_by_customer" | "duplicate" | "fraudulent",
): Promise<ActionResult<{ status: string; refund_id: string }>> {
  try {
    const data = await api.post<{ status: string; refund_id: string }>(
      endpoints.payments.stripe.refund,
      {
        booking_id: bookingId,
        reason,
      },
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to process refund",
    };
  }
}
