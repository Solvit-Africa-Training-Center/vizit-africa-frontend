/**
 * Unified types and schemas for the entire frontend application
 * Reduces duplication and provides single source of truth
 */

import { z } from "zod";

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Standard Action Result Type
 * Used for all server action responses
 */
export type ActionResult<T = any> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Standard API Response Wrapper
 * Used for typed error handling
 */
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T | null;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } | null;
  message?: string;
};

export type PaginatedData<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export type UserRole = "CLIENT" | "ADMIN" | "VENDOR";

export const userSchema = z.object({
  id: z.string().or(z.number()),
  email: z.string().email(),
  fullName: z.string(),
  phoneNumber: z.string().optional(),
  bio: z.string().nullable().optional(),
  role: z.enum(["CLIENT", "ADMIN", "VENDOR"]),
  preferred_currency: z.string().optional(),
  is_active: z.boolean().optional(),
  createdAt: z.string().optional(),
  vendor_profile: z
    .object({
      id: z.string().or(z.number()),
      businessName: z.string(),
      isApproved: z.boolean(),
    })
    .optional(),
});

export type User = z.infer<typeof userSchema>;

export const authResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: userSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// ============================================================================
// LOCATIONS
// ============================================================================

export const locationSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  country: z.string().optional(),
  region: z.string().optional(),
  description: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  createdAt: z.string().optional(),
});

export type Location = z.infer<typeof locationSchema>;

// ============================================================================
// SERVICES/VENDORS
// ============================================================================

export const serviceMediaSchema = z.object({
  id: z.string().or(z.number()),
  media_url: z.string(),
  media_type: z.enum(["image", "video"]),
  sort_order: z.number().optional(),
});

export type ServiceMedia = z.infer<typeof serviceMediaSchema>;

export const vendorSchema = z.object({
  id: z.string().or(z.number()),
  businessName: z.string(),
  isApproved: z.boolean(),
  user: z.string().or(z.number()).optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  vendorType: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  createdAt: z.string().optional(),
});

export type Vendor = z.infer<typeof vendorSchema>;

export const serviceSchema = z.object({
  id: z.string().or(z.number()),
  title: z.string(),
  serviceType: z.enum([
    "hotel",
    "car",
    "activity",
    "experience",
    "tour",
    "guide",
  ]),
  description: z.string(),
  basePrice: z.number().or(z.string()).transform(Number),
  currency: z.string(),
  capacity: z.number(),
  status: z.enum(["active", "inactive", "pending", "deleted"]),
  location: z.string().or(z.number()).nullable().optional(),
  user: z.string().or(z.number()).nullable().optional(),
  createdAt: z.string().optional(),
  externalId: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  media: z.array(serviceMediaSchema).optional(),
  vendor: vendorSchema.optional().nullable(),
});

export type Service = z.infer<typeof serviceSchema>;

// ============================================================================
// BOOKINGS & QUOTES
// ============================================================================

export const bookingItemSchema = z.preprocess(
  (data: any) => {
    if (data && typeof data === "object") {
      const processed = { ...data };
      // Handle both snake_case and camelCase (from toCamel)
      if (processed.service_id !== undefined) processed.serviceId = processed.service_id;
      if (processed.item_type !== undefined) processed.itemType = processed.item_type;
      if (processed.start_date !== undefined) processed.startDate = processed.start_date;
      if (processed.end_date !== undefined) processed.endDate = processed.end_date;
      if (processed.start_time !== undefined) processed.startTime = processed.start_time;
      if (processed.end_time !== undefined) processed.endTime = processed.end_time;
      if (processed.unit_price !== undefined) processed.unitPrice = processed.unit_price;
      return processed;
    }
    return data;
  },
  z.object({
    id: z.string().or(z.number()),
    serviceId: z.string().or(z.number()).optional().nullable(),
    service_id: z.string().or(z.number()).optional().nullable(),
    itemType: z.string().optional(),
    item_type: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    startDate: z.string().nullable().optional(),
    start_date: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    startTime: z.string().nullable().optional(),
    start_time: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    end_time: z.string().nullable().optional(),
    isRoundTrip: z.boolean().optional(),
    withDriver: z.boolean().optional(),
    returnDate: z.string().nullable().optional(),
    returnTime: z.string().nullable().optional(),
    quantity: z.number(),
    unitPrice: z.number().or(z.string()).transform(Number).optional(),
    unit_price: z.number().or(z.string()).transform(Number).optional(),
    subtotal: z.number().or(z.string()).transform(Number).optional(),
    status: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.string().optional(),
  }),
);

export type BookingItem = z.infer<typeof bookingItemSchema>;

export const bookingSchema = z.preprocess(
  (data: any) => {
    if (data && typeof data === "object") {
      const processed = { ...data };
      // Ensure id is present, checking both bookingId (camelCase) and booking_id (snake_case)
      if (!processed.id) {
        if (processed.bookingId) processed.id = processed.bookingId;
        else if (processed.booking_id) processed.id = processed.booking_id;
      }
      // Map totalAmount from snake_case if missing
      if (processed.total_amount !== undefined && processed.totalAmount === undefined) {
        processed.totalAmount = processed.total_amount;
      }
      return processed;
    }
    return data;
  },
  z.object({
    id: z.string().or(z.number()),
    booking_id: z.string().or(z.number()).optional(),
    bookingId: z.string().or(z.number()).optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    phone_number: z.string().optional(),
    departureCity: z.string().nullable().optional(),
    arrivalDate: z.string().nullable().optional(),
    departureDate: z.string().nullable().optional(),
    returnDate: z.string().nullable().optional(),
    travelers: z.number().optional(),
    adults: z.number().optional(),
    children: z.number().optional(),
    infants: z.number().optional(),
    needsFlights: z.boolean().optional(),
    needsHotel: z.boolean().optional(),
    needsCar: z.boolean().optional(),
    needsGuide: z.boolean().optional(),
    preferredCabinClass: z
      .enum(["economy", "premium_economy", "business", "first"])
      .optional(),
    hotelStarRating: z.string().optional(),
    carTypePreference: z.string().optional(),
    budgetBracket: z.string().optional(),
    guideLanguages: z.array(z.string()).optional(),
    status: z.enum([
      "pending",
      "quoted",
      "accepted",
      "paid",
      "confirmed",
      "cancelled",
      "completed",
    ]),
    paymentStatus: z
      .enum(["pending", "processing", "succeeded", "failed"])
      .optional(),
    payment_status: z.string().optional(),
    paymentIntentId: z.string().nullable().optional(),
    payment_intent_id: z.string().nullable().optional(),
    paymentCompletedAt: z.string().nullable().optional(),
    currency: z.string(),
    totalAmount: z.number().or(z.string()).transform(Number).optional(),
    total_amount: z.number().or(z.string()).transform(Number).optional(),
    specialRequests: z.string().optional(),
    tripPurpose: z.string().optional(),
    items: z.array(bookingItemSchema),
    createdAt: z.string(),
    notes: z.string().optional(),
  }),
);

export type Booking = z.infer<typeof bookingSchema>;

// ============================================================================
// PAYMENTS & TRANSACTIONS
// ============================================================================

export const transactionSchema = z.object({
  id: z.string().or(z.number()),
  booking: z.string().or(z.number()),
  user: z.string().or(z.number()).optional(),
  amount: z.number().or(z.string()).transform(Number),
  currency: z.string(),
  status: z.enum(["pending", "completed", "failed"]),
  transactionType: z.enum(["commission", "payout", "refund"]),
  createdAt: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;

// ============================================================================
// SAVED ITEMS
// ============================================================================

export const savedItemSchema = z.object({
  id: z.string().or(z.number()),
  createdAt: z.string(),
  objectId: z.string().or(z.number()),
  contentObject: z.object({
    id: z.string().or(z.number()),
    type: z.string(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export type SavedItem = z.infer<typeof savedItemSchema>;

// ============================================================================
// TYPE ALIASES FOR BACKWARDS COMPATIBILITY
// ============================================================================

export type ServiceResponse = Service;
export type VendorResponse = Vendor;
export type LocationResponse = Location;

export interface VendorRequest {
  id: string | number;
  serviceId: string | number;
  serviceName: string;
  startDate: string;
  endDate: string;
  quantity: number;
  status: string;
  customerName?: string;
  customerEmail?: string;
}

// ============================================================================
// FORM INPUT SCHEMAS
// ============================================================================

export const loginInputSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerObjectSchema = z
  .object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phoneNumber: z.string().min(6, "Phone is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rePassword: z.string(),
    role: z.enum(["CLIENT", "ADMIN", "VENDOR"]),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

export type RegisterInput = z.infer<typeof registerObjectSchema>;

export const setPasswordInputSchema = z
  .object({
    uidb64: z.string(),
    token: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

export type SetPasswordInput = z.infer<typeof setPasswordInputSchema>;

export const createServiceInputSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  serviceType: z.string(),
  basePrice: z.number().min(0),
  location: z.string().or(z.number()).optional(),
  user: z.string().or(z.number()).optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

export const createVendorInputSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email(),
  phoneNumber: z.string(),
  bio: z.string().optional().or(z.literal("")),
  businessName: z.string().min(2, "Business name is required"),
  vendorType: z.enum([
    "hotel",
    "car_rental",
    "guide",
    "experience",
    "transport",
    "other",
  ]),
  address: z.string().min(1, "Address is required"),
  website: z.string().url().optional().or(z.literal("")).or(z.null()),
});

export type CreateVendorInput = z.infer<typeof createVendorInputSchema>;
