"use server";

import { api, ApiError } from "@/lib/api/simple-client";
import { endpoints } from "./endpoints";
import { bookingSchema } from "@/lib/unified-types";
import type { Booking, ActionResult } from "@/lib/unified-types";

export type { ActionResult };

export async function getBookingById(
  id: string,
): Promise<ActionResult<Booking>> {
  try {
    const data = await api.get(endpoints.bookings.detail(id), bookingSchema);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to fetch booking",
    };
  }
}

export async function getAdminBookings(): Promise<ActionResult<Booking[]>> {
  try {
    const data = await api.get<Booking[]>(endpoints.bookings.admin.list);
    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to fetch bookings",
    };
  }
}

export async function submitTrip(
  tripData: Record<string, any>,
): Promise<ActionResult<{ id: string }>> {
  try {
    const result = await api.post(endpoints.bookings.submitTrip, tripData);
    return { success: true, data: result as { id: string } };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        fieldErrors: error.details as Record<string, string[]> | undefined,
      };
    }
    return { success: false, error: "Failed to submit trip" };
  }
}

export async function confirmBooking(
  bookingId: string,
): Promise<ActionResult<Booking>> {
  try {
    const data = await api.post(
      `${endpoints.bookings.confirm}`,
      { booking_id: bookingId },
      bookingSchema,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to confirm booking",
    };
  }
}

export async function getAdminBookingById(
  id: string,
): Promise<ActionResult<Booking>> {
  try {
    const data = await api.get(endpoints.bookings.admin.detail(id), bookingSchema);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to fetch booking",
    };
  }
}

export async function getUserBookings(): Promise<ActionResult<Booking[]>> {
  try {
    const data = await api.get<Booking[]>(endpoints.bookings.list);
    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to fetch bookings",
    };
  }
}

// Aliases for backwards compatibility
export const submitTripRequest = submitTrip;
export const acceptQuoteForBooking = confirmBooking;

export async function cancelBooking(
  bookingId: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    const result = await api.post(
      endpoints.bookings.cancel(bookingId),
      { booking_id: bookingId },
    );
    return { success: true, data: result as { message: string } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to cancel booking",
    };
  }
}

export async function sendQuoteForBooking(
  bookingId: string,
  amount: number,
): Promise<ActionResult<{ message: string }>> {
  try {
    const result = await api.post(
      endpoints.bookings.quote(bookingId),
      { booking_id: bookingId, amount },
    );
    return { success: true, data: result as { message: string } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to send quote",
    };
  }
}

export async function notifyVendor(
  bookingId: string,
  itemId?: string,
  serviceId?: string | number,
  metadata?: Record<string, any>,
): Promise<ActionResult<{ message: string }>> {
  try {
    const result = await api.post(
      endpoints.bookings.notifyVendor(bookingId),
      {
        booking_id: bookingId,
        item_id: itemId,
        service_id: serviceId,
        ...metadata,
      },
    );
    return { success: true, data: result as { message: string } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to notify vendor",
    };
  }
}

