"use server";

import { api, ApiError } from "@/lib/api/simple-client";
import { endpoints } from "./endpoints";
import { bookingSchema } from "@/lib/unified-types";
import type { Booking, ActionResult, BookingItem } from "@/lib/unified-types";
import { logger } from "@/lib/utils/logger";
import { getSession } from "@/lib/auth/session";

export async function getBookingById(
  id: string,
): Promise<ActionResult<Booking>> {
  try {
    const data = await api.get(endpoints.bookings.detail(id), bookingSchema);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to fetch booking",
    };
  }
}

export async function getAdminBookings(): Promise<ActionResult<Booking[]>> {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    const data = await api.get<Booking[]>(endpoints.bookings.admin.list);
    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to fetch bookings",
    };
  }
}

export async function submitTrip(
  tripData: Partial<Booking>,
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
  booking_id: string,
): Promise<ActionResult<Booking>> {
  try {
    const data = await api.post(
      `${endpoints.bookings.confirm}`,
      { booking_id },
      bookingSchema,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to confirm booking",
    };
  }
}

export async function getAdminBookingById(
  id: string,
): Promise<ActionResult<Booking>> {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    const data = await api.get(
      endpoints.bookings.admin.detail(id),
      bookingSchema,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to fetch booking",
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
      error:
        error instanceof ApiError ? error.message : "Failed to fetch bookings",
    };
  }
}

export async function acceptQuoteForBooking(
  booking_id: string,
): Promise<ActionResult<Booking>> {
  logger.info(`Accepting quote for booking ${booking_id}`);
  try {
    // Send an empty body as the ID is already in the URL
    await api.post(endpoints.bookings.accept(booking_id), {});

    // Refetch the full booking to ensure we have all data (including the full schema)
    return await getBookingById(booking_id);
  } catch (error) {
    const errorMsg =
      error instanceof ApiError ? error.message : "Failed to accept quote";
    logger.error(`Failed to accept quote for booking ${booking_id}: ${errorMsg}`, {
      booking_id,
      error,
    });
    return {
      success: false,
      error: errorMsg,
    };
  }
}

// Aliases for backwards compatibility
export const submitTripRequest = submitTrip;

export async function cancelBooking(
  booking_id: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    const result = await api.post(endpoints.bookings.cancel(booking_id), {
      booking_id,
    });
    return { success: true, data: result as { message: string } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to cancel booking",
    };
  }
}

export async function sendQuoteForBooking(
  booking_id: string,
  amount: number,
  items: Partial<BookingItem>[] = [],
): Promise<ActionResult<{ message: string }>> {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  logger.info(`Sending quote for booking ${booking_id}`, { amount, itemCount: items.length });
  try {
    const result = await api.post(endpoints.bookings.quote(booking_id), {
      booking_id,
      amount,
      total_amount: amount,
      items,
    });
    logger.info(`Successfully sent quote for booking ${booking_id}`);
    return { success: true, data: result as { message: string } };
  } catch (error) {
    const errorMsg = error instanceof ApiError ? error.message : "Failed to send quote";
    logger.error(`Failed to send quote for booking ${booking_id}: ${errorMsg}`, { 
      booking_id,
      amount,
      itemCount: items.length,
      error 
    });
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function updateBooking(
  id: string,
  data: Partial<Booking>,
): Promise<ActionResult<Booking>> {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  logger.info(`Updating booking ${id}`, { data });
  try {
    const result = await api.patch(
      endpoints.bookings.detail(id),
      data,
      bookingSchema,
    );
    return { success: true, data: result };
  } catch (error) {
    const errorMsg =
      error instanceof ApiError ? error.message : "Failed to update booking";
    logger.error(`Failed to update booking ${id}: ${errorMsg}`, { id, error });
    return { success: false, error: errorMsg };
  }
}

export async function notifyVendor(
  booking_id: string,
  item_id?: string,
  service_id?: string | number,
  metadata?: Record<string, unknown>,
): Promise<ActionResult<{ message: string }>> {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  logger.info(`Notifying vendor for booking ${booking_id}`, { item_id, service_id });
  try {
    const result = await api.post(endpoints.bookings.notifyVendor(booking_id), {
      booking_id,
      item_id,
      service_id,
      ...metadata,
    });
    logger.info(`Successfully notified vendor for booking ${booking_id}`);
    return { success: true, data: result as { message: string } };
  } catch (error) {
    logger.error(`Failed to notify vendor for booking ${booking_id}`, { error });
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to notify vendor",
    };
  }
}
