"use server";

import { api } from "@/lib/api/client";
import type { ActionResult, ApiError } from "@/lib/api/types";
import {
  type CashTransactionInput,
  cashTransactionInputSchema,
  type PaymentResponse,
  paymentResponseSchema,
} from "@/lib/schema/payment-schema";
import {
  buildValidationErrorMessage,
  normalizeFieldErrors,
} from "@/lib/validation/error-message";
import { endpoints } from "./endpoints";

export async function cashIn(
  input: CashTransactionInput,
): Promise<ActionResult<PaymentResponse>> {
  const validation = cashTransactionInputSchema.safeParse(input);
  if (!validation.success) {
    const flattened = validation.error.flatten();
    const fieldErrors = normalizeFieldErrors(flattened.fieldErrors);
    return {
      success: false,
      error: buildValidationErrorMessage({
        fieldErrors,
        formErrors: flattened.formErrors,
      }),
      fieldErrors,
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
    const flattened = validation.error.flatten();
    const fieldErrors = normalizeFieldErrors(flattened.fieldErrors);
    return {
      success: false,
      error: buildValidationErrorMessage({
        fieldErrors,
        formErrors: flattened.formErrors,
      }),
      fieldErrors,
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
