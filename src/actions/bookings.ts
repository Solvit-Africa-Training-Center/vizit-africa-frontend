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
  bookingId: string,
): Promise<ActionResult<Booking>> {
  logger.info(`Accepting quote for booking ${bookingId}`);
  try {
    const data = await api.post(
      endpoints.bookings.accept(bookingId),
      { booking_id: bookingId },
      bookingSchema,
    );
    logger.info(`Successfully accepted quote for booking ${bookingId}`);
    return { success: true, data };
  } catch (error) {
    const errorMsg =
      error instanceof ApiError ? error.message : "Failed to accept quote";
    logger.error(`Failed to accept quote for booking ${bookingId}: ${errorMsg}`, {
      bookingId,
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
  bookingId: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    const result = await api.post(endpoints.bookings.cancel(bookingId), {
      booking_id: bookingId,
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
  bookingId: string,
  amount: number,
  items: Partial<BookingItem>[] = [],
): Promise<ActionResult<{ message: string }>> {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  logger.info(`Sending quote for booking ${bookingId}`, { amount, itemCount: items.length });
  try {
    const result = await api.post(endpoints.bookings.quote(bookingId), {
      booking_id: bookingId,
      amount,
      total_amount: amount, // Send both just in case
      items,
    });
    logger.info(`Successfully sent quote for booking ${bookingId}`);
    return { success: true, data: result as { message: string } };
  } catch (error) {
    const errorMsg = error instanceof ApiError ? error.message : "Failed to send quote";
    logger.error(`Failed to send quote for booking ${bookingId}: ${errorMsg}`, { 
      bookingId,
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
  bookingId: string,
  itemId?: string,
  serviceId?: string | number,
  metadata?: Record<string, unknown>,
): Promise<ActionResult<{ message: string }>> {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  logger.info(`Notifying vendor for booking ${bookingId}`, { itemId, serviceId });
  try {
    const result = await api.post(endpoints.bookings.notifyVendor(bookingId), {
      booking_id: bookingId,
      item_id: itemId,
      service_id: serviceId,
      ...metadata,
    });
    logger.info(`Successfully notified vendor for booking ${bookingId}`);
    return { success: true, data: result as { message: string } };
  } catch (error) {
    logger.error(`Failed to notify vendor for booking ${bookingId}`, { error });
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to notify vendor",
    };
  }
}
