"use server";

import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import { bookingListSchema, type BookingList } from "@/lib/schema/booking-schema";
import type { Booking } from "@/types";
import { type ActionResult, ApiError } from "@/lib/api/types";
import { type TripInfo, type TripItem } from "@/lib/plan_trip-types";

import { logout } from "./auth";

function normalizeRequestedType(item: TripItem): string {
  if (item.type !== "service") return item.type;

  const category = String((item as any)?.data?.category || "").toLowerCase();
  if (category.includes("flight")) return "flight";
  if (category.includes("hotel") || category.includes("bnb")) return "hotel";
  if (category.includes("car")) return "car";
  if (category.includes("guide")) return "guide";
  return "service";
}

/**
 * Fetch a single booking by ID for the current authenticated user
 */
export async function getBookingById(id: string): Promise<ActionResult<Booking>> {
  try {
    const data = await api.get<Booking>(endpoints.bookings.detail(id));
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message || "Failed to fetch booking",
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
      } catch { }
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
): Promise<ActionResult<any>> {
  try {
    const payload = {
      ...tripInfo,
      items: items.map((item) => ({
        id: item.id,
        service: item.id,
        quantity: item.quantity || 1,
        start_date: item.startDate || tripInfo.departureDate,
        end_date: item.endDate || tripInfo.returnDate,
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
      { requiresAuth: false },
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
): Promise<ActionResult<any>> {
  try {
    const payload = {
      items,
      notes,
      currency: "USD",
    };

    const data = await api.post(
      endpoints.bookings.quote(bookingId),
      payload,
    );

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
): Promise<ActionResult<any>> {
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
