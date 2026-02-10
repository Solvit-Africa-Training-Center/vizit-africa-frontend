"use server";

import { type ActionResult, ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import {
  type CashTransactionInput,
  type PaymentResponse,
  cashTransactionInputSchema,
  paymentResponseSchema,
} from "@/lib/schema/payment-schema";

export async function cashIn(
  input: CashTransactionInput,
): Promise<ActionResult<PaymentResponse>> {
  const validation = cashTransactionInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.payments.cashIn,
      validation.data,
      paymentResponseSchema,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function cashOut(
  input: CashTransactionInput,
): Promise<ActionResult<PaymentResponse>> {
  const validation = cashTransactionInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.payments.cashOut,
      validation.data,
      paymentResponseSchema,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}
