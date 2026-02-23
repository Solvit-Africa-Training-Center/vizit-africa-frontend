/**
 * Simplified Data Fetching
 * Generic factory pattern to eliminate code duplication
 */

"use server";

import { api } from "@/lib/api/simple-client";
import { endpoints } from "@/actions/endpoints";
import type { ApiResponse, PaginatedData } from "@/lib/unified-types";
import {
  bookingSchema,
  serviceSchema,
  vendorSchema,
  userSchema,
  locationSchema,
  transactionSchema,
  savedItemSchema,
} from "@/lib/unified-types";
import { type ZodSchema } from "zod";

/**
 * Generic factory for single item fetch
 */
async function fetchOne<T>(
  endpoint: string,
  schema: ZodSchema<T>,
): Promise<T | null> {
  try {
    const data = await api.get<T>(endpoint, schema, {
      requiresAuth: false,
      cache: "no-store",
    });
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to fetch from ${endpoint}:`, error);
    }
    return null;
  }
}

/**
 * Generic factory for list fetch
 */
async function fetchList<T>(
  endpoint: string,
  schema: ZodSchema<T>,
  options?: {
    requiresAuth?: boolean;
    revalidate?: number;
    tag?: string;
  },
): Promise<T[]> {
  try {
    const data = await api.get<T[]>(endpoint, undefined, {
      requiresAuth: options?.requiresAuth ?? false,
      next: {
        revalidate: options?.revalidate ?? 3600,
        tags: options?.tag ? [options.tag] : [],
      },
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to fetch list from ${endpoint}:`, error);
    }
    return [];
  }
}

/**
 * Generic factory for paginated fetch
 */
async function fetchPaginated<T>(
  endpoint: string,
  schema: ZodSchema<T>,
  options?: {
    requiresAuth?: boolean;
    revalidate?: number;
  },
): Promise<PaginatedData<T>> {
  try {
    const response = await api.get<PaginatedData<T>>(endpoint, undefined, {
      requiresAuth: options?.requiresAuth ?? false,
      next: {
        revalidate: options?.revalidate ?? 3600,
      },
    });
    return response || { results: [], count: 0, next: null, previous: null };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to fetch paginated from ${endpoint}:`, error);
    }
    return { results: [], count: 0, next: null, previous: null };
  }
}

// ============================================================================
// BOOKINGS
// ============================================================================

export async function getBookings(): Promise<any[]> {
  return fetchList(endpoints.bookings.admin.list, bookingSchema, {
    requiresAuth: true,
    revalidate: 60,
    tag: "requests",
  });
}

export async function getBookingById(id: string | number): Promise<any | null> {
  return fetchOne(endpoints.bookings.admin.detail(id), bookingSchema);
}

export async function getRequests(): Promise<any[]> {
  return getBookings();
}

export async function getRequestById(id: string | number): Promise<any | null> {
  return getBookingById(id);
}

// ============================================================================
// USERS
// ============================================================================

export async function getUsers(): Promise<any[]> {
  return fetchList(endpoints.auth.list, userSchema, {
    requiresAuth: true,
    revalidate: 3600,
    tag: "users",
  });
}

export async function getUserProfile(): Promise<any | null> {
  return fetchOne(endpoints.auth.me, userSchema);
}

// ============================================================================
// SERVICES
// ============================================================================

export async function getServices(category?: string): Promise<any[]> {
  const url = category
    ? `${endpoints.services.list}?service_type=${category}`
    : endpoints.services.list;

  return fetchList(url, serviceSchema, {
    requiresAuth: false,
    revalidate: 3600,
    tag: "services",
  });
}

export async function getServiceById(id: string | number): Promise<any | null> {
  return fetchOne(endpoints.services.details(id), serviceSchema);
}

// ============================================================================
// VENDORS
// ============================================================================

export async function getVendors(): Promise<any[]> {
  return fetchList(endpoints.vendors.list, vendorSchema, {
    requiresAuth: false,
    revalidate: 3600,
    tag: "vendors",
  });
}

export async function getVendorById(id: string | number): Promise<any | null> {
  return fetchOne(endpoints.vendors.detail(id), vendorSchema);
}

// ============================================================================
// LOCATIONS
// ============================================================================

export async function getLocations(): Promise<any[]> {
  return fetchList(endpoints.locations.list, locationSchema, {
    requiresAuth: false,
    revalidate: 3600,
    tag: "locations",
  });
}

export async function getLocationById(
  id: string | number,
): Promise<any | null> {
  // Locations endpoint doesn't support individual detail fetching
  // Return null for now
  return null;
}

// ============================================================================
// SAVED ITEMS
// ============================================================================

export async function getSavedItems(): Promise<any[]> {
  return fetchList(endpoints.accounts.savedItems.list, savedItemSchema, {
    requiresAuth: true,
    revalidate: 300,
    tag: "saved-items",
  });
}

// ============================================================================
// TRANSACTIONS
// ============================================================================

export async function getTransactions(): Promise<any[]> {
  return fetchList(endpoints.bookings.transactions, transactionSchema, {
    requiresAuth: true,
    revalidate: 300,
    tag: "transactions",
  });
}

export async function getVendorPayouts(): Promise<any[]> {
  return fetchList(endpoints.bookings.vendorPayouts, transactionSchema, {
    requiresAuth: true,
    revalidate: 300,
    tag: "vendor-payouts",
  });
}
