"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import {
  type AddCartItemInput,
  type AddCartItemResponse,
  type ConfirmBookingResponse,
  type GenerateTicketResponse,
  type VerifyTicketInput,
  type VerifyTicketResponse,
  type AdminActionResponse,
  addCartItemInputSchema,
  addCartItemResponseSchema,
  confirmBookingResponseSchema,
  generateTicketResponseSchema,
  verifyTicketInputSchema,
  verifyTicketResponseSchema,
  adminActionResponseSchema,
} from "@/lib/schema/booking-schema";

export async function addCartItem(
  input: AddCartItemInput,
): Promise<ActionResult<AddCartItemResponse>> {
  const validation = addCartItemInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.bookings.items.create,
      validation.data,
      addCartItemResponseSchema,
    );
    revalidatePath("/cart");
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function confirmBooking(): Promise<
  ActionResult<ConfirmBookingResponse>
> {
  try {
    const data = await api.post(
      endpoints.bookings.confirm,
      {},
      confirmBookingResponseSchema,
    );
    revalidatePath("/bookings");
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}

export async function generateTicket(
  bookingId: string | number,
): Promise<ActionResult<GenerateTicketResponse>> {
  try {
    const data = await api.post(
      endpoints.bookings.tickets.generate(bookingId),
      {},
      generateTicketResponseSchema,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}

export async function verifyTicket(
  input: VerifyTicketInput,
): Promise<ActionResult<VerifyTicketResponse>> {
  const validation = verifyTicketInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid QR Code",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.bookings.tickets.verify,
      validation.data,
      verifyTicketResponseSchema,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function processCommission(
  bookingId: string | number,
): Promise<ActionResult<AdminActionResponse>> {
  try {
    await api.post(endpoints.bookings.commission(bookingId), {}, undefined);
    return {
      success: true,
      data: { success: true, message: "Commission processed" },
    };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}

export async function processPayout(
  bookingId: string | number,
): Promise<ActionResult<AdminActionResponse>> {
  try {
    await api.post(endpoints.bookings.payout(bookingId), {}, undefined);
    return {
      success: true,
      data: { success: true, message: "Payout processed" },
    };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}

export async function processRefund(
  bookingId: string | number,
): Promise<ActionResult<AdminActionResponse>> {
  try {
    await api.post(endpoints.bookings.refund(bookingId), {}, undefined);
    return {
      success: true,
      data: { success: true, message: "Refund processed" },
    };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}
