"use server";

import { api, ApiError } from "@/lib/api/simple-client";
import { transactionSchema } from "@/lib/unified-types";
import { endpoints } from "./endpoints";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function cashIn(input: unknown): Promise<ActionResult<any>> {
  try {
    const data = await api.post(endpoints.payments.cashIn, input, transactionSchema);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function cashOut(input: unknown): Promise<ActionResult<any>> {
  try {
    const data = await api.post(endpoints.payments.cashOut, input, transactionSchema);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}
