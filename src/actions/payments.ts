"use server";

import { api, ApiError } from "@/lib/api/simple-client";
import { type ActionResult } from "@/lib/unified-types";
import { endpoints } from "./endpoints";
import { logger } from "@/lib/utils/logger";

export async function createPaymentIntent(booking_id: string): Promise<
  ActionResult<{
    clientSecret: string;
    paymentIntentId: string;
  }>
> {
  logger.info(`Creating payment intent for booking ${booking_id}`);
  try {
    const data = await api.post<{
      clientSecret: string;
      paymentIntentId: string;
    }>(endpoints.payments.stripe.createIntent, { booking_id });
    logger.info(`Successfully created payment intent for booking ${booking_id}`);
    return { success: true, data };
  } catch (error) {
    const errorMsg = error instanceof ApiError ? error.message : "Failed to create payment intent";
    logger.error(`Failed to create payment intent for booking ${booking_id}: ${errorMsg}`, { 
      booking_id,
      error 
    });
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function confirmStripePayment(
  payment_intent_id: string,
  payment_method_id: string,
): Promise<ActionResult<{ status: string }>> {
  logger.info(`Confirming Stripe payment for intent ${payment_intent_id}`);
  try {
    const data = await api.post<{ status: string }>(
      endpoints.payments.stripe.confirm,
      {
        payment_intent_id,
        payment_method_id,
      },
    );
    logger.info(`Successfully confirmed payment for intent ${payment_intent_id}`);
    return { success: true, data };
  } catch (error) {
    const errorMsg = error instanceof ApiError ? error.message : "Failed to confirm payment";
    logger.error(`Failed to confirm Stripe payment for intent ${payment_intent_id}: ${errorMsg}`, {
      payment_intent_id,
      payment_method_id,
      error
    });
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function refundPayment(
  booking_id: string,
  reason: "requested_by_customer" | "duplicate" | "fraudulent",
): Promise<ActionResult<{ status: string; refundId: string }>> {
  logger.info(`Processing refund for booking ${booking_id}`, { reason });
  try {
    const data = await api.post<{ status: string; refundId: string }>(
      endpoints.payments.stripe.refund,
      {
        booking_id,
        reason,
      },
    );
    logger.info(`Successfully processed refund for booking ${booking_id}`);
    return { success: true, data };
  } catch (error) {
    const errorMsg = error instanceof ApiError ? error.message : "Failed to process refund";
    logger.error(`Failed to process refund for booking ${booking_id}: ${errorMsg}`, {
      booking_id,
      reason,
      error
    });
    return {
      success: false,
      error: errorMsg,
    };
  }
}
