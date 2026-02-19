"use server";

import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import {
  bookingListSchema,
  bookingSchema,
  type Booking,
  type AdminBooking,
  type BookingList,
} from "@/lib/schema/booking-schema";
import type { ActionResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";
import type { TripInfo, TripItem } from "@/lib/plan_trip-types";

import { logout } from "./auth";

function normalizeRequestedType(item: TripItem): string {
  if (item.type !== "service") return item.type;

  const data = (item as any)?.data;
  const category = String(data?.category || "").toLowerCase();
  if (category.includes("flight")) return "flight";
  if (category.includes("hotel") || category.includes("bnb")) return "hotel";
  if (category.includes("car")) return "car";
  if (category.includes("guide")) return "guide";
  return "service";
}

/**
 * Fetch a single booking by ID for the current authenticated user
 */
export async function getBookingById(
  id: string,
): Promise<ActionResult<Booking>> {
  try {
    const data = await api.get(endpoints.bookings.detail(id), bookingSchema);
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to fetch booking",
    };
  }
}

export async function getAdminBookings(): Promise<
  ActionResult<AdminBooking[]>
> {
  try {
    const data = await api.get<AdminBooking[]>(endpoints.bookings.admin.list);
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to fetch admin bookings",
    };
  }
}

export async function getAdminBookingById(
  id: string,
): Promise<ActionResult<AdminBooking>> {
  try {
    const data = await api.get<AdminBooking>(
      endpoints.bookings.admin.detail(id),
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to fetch admin booking",
    };
  }
}

/**
 * Fetch bookings for the current authenticated user
 */
export async function getUserBookings(): Promise<ActionResult<BookingList>> {
  try {
    const data = await api.get(endpoints.bookings.list, bookingListSchema);
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    if (err.status === 401) {
      try {
        await logout();
      } catch {}
    }
    return {
      success: false,
      error: err.message || "Failed to fetch bookings",
    };
  }
}

/**
 * Submit a new trip request (Guest or Authenticated)
 */
export async function submitTripRequest(
  tripInfo: TripInfo,
  items: TripItem[],
): Promise<ActionResult<unknown>> {
  try {
    const payload = {
      ...tripInfo,
      items: items.map((item) => ({
        id: item.id,
        service: item.id,
        quantity: item.quantity || 1,
        start_date: item.startDate || tripInfo.departureDate,
        end_date: item.endDate || tripInfo.returnDate,
        start_time: item.startTime,
        end_time: item.endTime,
        is_round_trip: item.isRoundTrip,
        return_date: item.returnDate,
        unit_price: item.price || 0,
        type: normalizeRequestedType(item),
        category: (item as any)?.data?.category || "",
        title: item.title,
        description: item.description || "",
      })),
    };

    const data = await api.post(
      endpoints.bookings.submitTrip,
      payload,
      undefined,
    );

    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to submit trip request",
      fieldErrors: err.fieldErrors,
    };
  }
}

export async function sendQuoteForBooking(
  bookingId: string,
  items: Array<{
    id?: string;
    service?: string;
    type?: string;
    title?: string;
    description?: string;
    quantity?: number;
    unit_price?: number;
  }>,
  notes = "",
): Promise<ActionResult<unknown>> {
  try {
    const payload = {
      items,
      notes,
      currency: "USD",
    };

    const data = await api.post(endpoints.bookings.quote(bookingId), payload);

    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to send quote",
      fieldErrors: err.fieldErrors,
    };
  }
}

export async function acceptQuoteForBooking(
  bookingId: string,
): Promise<ActionResult<unknown>> {
  try {
    const data = await api.post(endpoints.bookings.accept(bookingId), {});
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to accept quote",
      fieldErrors: err.fieldErrors,
    };
  }
}

export async function cancelBooking(
  bookingId: string,
): Promise<ActionResult<unknown>> {
  try {
    const data = await api.post(endpoints.bookings.cancel(bookingId), {});
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to cancel booking",
      fieldErrors: err.fieldErrors,
    };
  }
}

export async function notifyVendor(
  bookingId: string,
  itemId?: string,
  serviceId?: string,
  details?: Record<string, unknown>,
): Promise<ActionResult<unknown>> {
  try {
    const payload = {
      item_id: itemId,
      service_id: serviceId,
      ...details,
    };
    const data = await api.post(
      endpoints.bookings.notifyVendor(bookingId),
      payload,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to notify vendor",
      fieldErrors: err.fieldErrors,
    };
  }
}
