"use server";

import { api, ApiError } from "@/lib/api/simple-client";
import { type ActionResult } from "@/lib/unified-types";
import { endpoints } from "./endpoints";
import { logger } from "@/lib/utils/logger";

export async function createPaymentIntent(bookingId: string): Promise<
  ActionResult<{
    client_secret: string;
    payment_intent_id: string;
  }>
> {
  logger.info(`Creating payment intent for booking ${bookingId}`);
  try {
    const data = await api.post<{
      client_secret: string;
      payment_intent_id: string;
    }>(endpoints.payments.stripe.createIntent, { booking_id: bookingId });
    logger.info(`Successfully created payment intent for booking ${bookingId}`);
    return { success: true, data };
  } catch (error) {
    const errorMsg = error instanceof ApiError ? error.message : "Failed to create payment intent";
    logger.error(`Failed to create payment intent for booking ${bookingId}: ${errorMsg}`, { 
      bookingId,
      error 
    });
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function confirmStripePayment(
  paymentIntentId: string,
  paymentMethodId: string,
): Promise<ActionResult<{ status: string }>> {
  logger.info(`Confirming Stripe payment for intent ${paymentIntentId}`);
  try {
    const data = await api.post<{ status: string }>(
      endpoints.payments.stripe.confirm,
      {
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId,
      },
    );
    logger.info(`Successfully confirmed payment for intent ${paymentIntentId}`);
    return { success: true, data };
  } catch (error) {
    const errorMsg = error instanceof ApiError ? error.message : "Failed to confirm payment";
    logger.error(`Failed to confirm Stripe payment for intent ${paymentIntentId}: ${errorMsg}`, {
      paymentIntentId,
      paymentMethodId,
      error
    });
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function refundPayment(
  bookingId: string,
  reason: "requested_by_customer" | "duplicate" | "fraudulent",
): Promise<ActionResult<{ status: string; refund_id: string }>> {
  logger.info(`Processing refund for booking ${bookingId}`, { reason });
  try {
    const data = await api.post<{ status: string; refund_id: string }>(
      endpoints.payments.stripe.refund,
      {
        booking_id: bookingId,
        reason,
      },
    );
    logger.info(`Successfully processed refund for booking ${bookingId}`);
    return { success: true, data };
  } catch (error) {
    const errorMsg = error instanceof ApiError ? error.message : "Failed to process refund";
    logger.error(`Failed to process refund for booking ${bookingId}: ${errorMsg}`, {
      bookingId,
      reason,
      error
    });
    return {
      success: false,
      error: errorMsg,
    };
  }
}
