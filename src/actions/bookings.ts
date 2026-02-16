"use server";

import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import { bookingListSchema, type BookingList } from "@/lib/schema/booking-schema";
import { type ActionResult, ApiError } from "@/lib/api/types";
import { type TripInfo, type TripItem } from "@/lib/plan_trip-types";

import { logout } from "./auth";

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
        type: item.type,
        title: item.title,
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
