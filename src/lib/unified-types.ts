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
 * All backend responses follow this structure
 */
export const apiResponseSchema = <T extends z.ZodTypeAny = z.ZodTypeAny>(
  dataSchema?: T,
) =>
  z.object({
    success: z.boolean(),
    data: dataSchema ? dataSchema.nullable().optional() : z.unknown().optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.string(), z.unknown()).optional(),
      })
      .nullable()
      .optional(),
    message: z.string().optional(),
  });

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

/**
 * Paginated Response
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.boolean(),
    data: z.object({
      results: z.array(dataSchema),
      count: z.number(),
      next: z.string().nullable(),
      previous: z.string().nullable(),
    }),
    error: z.null().optional(),
    message: z.string().optional(),
  });

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
  full_name: z.string(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["CLIENT", "ADMIN", "VENDOR"]),
  preferred_currency: z.string().optional(),
  is_active: z.boolean().optional(),
  created_at: z.string().optional(),
  vendor_profile: z
    .object({
      id: z.string().or(z.number()),
      business_name: z.string(),
      is_approved: z.boolean(),
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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image_url: z.string().optional(),
  created_at: z.string().optional(),
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
  business_name: z.string(),
  is_approved: z.boolean(),
  user: z.string().or(z.number()).optional(),
  full_name: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  vendor_type: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  created_at: z.string().optional(),
});

export type Vendor = z.infer<typeof vendorSchema>;

export const serviceSchema = z.object({
  id: z.string().or(z.number()),
  title: z.string(),
  service_type: z.enum([
    "flight",
    "hotel",
    "car",
    "activity",
    "experience",
    "tour",
    "guide",
  ]),
  description: z.string(),
  base_price: z.number().or(z.string()).transform(Number),
  currency: z.string(),
  capacity: z.number(),
  status: z.enum(["active", "inactive", "pending", "deleted"]),
  location: z.string().or(z.number()).nullable().optional(),
  user: z.string().or(z.number()).nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  external_id: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  media: z.array(serviceMediaSchema).optional(),
  vendor: vendorSchema.optional(),
});

export type Service = z.infer<typeof serviceSchema>;

// ============================================================================
// BOOKINGS & QUOTES
// ============================================================================

export const bookingItemSchema = z.object({
  id: z.string().or(z.number()),
  service: z.string().or(z.number()).optional(),
  type: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isRoundTrip: z.boolean().optional(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  quantity: z.number(),
  unitPrice: z.number().or(z.string()).transform(Number),
  subtotal: z.number().or(z.string()).transform(Number),
  status: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().optional(),
});

export type BookingItem = z.infer<typeof bookingItemSchema>;

export const quoteSchema = z.object({
  status: z.enum(["quoted", "accepted", "expired"]),
  sentAt: z.string().optional(),
  sentBy: z.string().optional(),
  currency: z.string(),
  totalAmount: z.number().or(z.string()).transform(Number),
  notes: z.string().optional(),
  items: z.array(bookingItemSchema),
  expiresAt: z.string().optional(),
  acceptedAt: z.string().optional(),
  acceptedBy: z.string().optional(),
});

export type Quote = z.infer<typeof quoteSchema>;

export const bookingSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  arrivalDate: z.string().nullable().optional(),
  departureDate: z.string().nullable().optional(),
  returnDate: z.string().nullable().optional(),
  arrivalTime: z.string().nullable().optional(),
  departureTime: z.string().nullable().optional(),
  returnTime: z.string().nullable().optional(),
  isRoundTrip: z.boolean().optional(),
  travelers: z.number(),
  adults: z.number(),
  children: z.number(),
  infants: z.number(),
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
  status: z.enum(["pending", "quoted", "confirmed", "cancelled", "completed"]),
  currency: z.string(),
  totalAmount: z.number().or(z.string()).transform(Number).optional(),
  specialRequests: z.string().optional(),
  tripPurpose: z.string().optional(),
  items: z.array(bookingItemSchema),
  requestedItems: z.array(bookingItemSchema).optional(),
  quote: quoteSchema.nullable().optional(),
  createdAt: z.string(),
  notes: z.string().optional(),
});

export type Booking = z.infer<typeof bookingSchema>;

// ============================================================================
// PAYMENTS & TRANSACTIONS
// ============================================================================

export const transactionSchema = z.object({
  id: z.string().or(z.number()),
  booking: z.string().or(z.number()),
  amount: z.number().or(z.string()).transform(Number),
  currency: z.string(),
  status: z.enum(["pending", "completed", "failed", "refunded"]),
  payment_method: z.string(),
  transaction_type: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  reference: z.string().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;

// ============================================================================
// SAVED ITEMS
// ============================================================================

export const savedItemSchema = z.object({
  id: z.string().or(z.number()),
  created_at: z.string(),
  object_id: z.string().or(z.number()),
  content_object: z.object({
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
export type BaseItem = any; // Trip item type

export interface VendorRequest {
  id: string | number;
  service_id: string | number;
  service_name: string;
  start_date: string;
  end_date: string;
  quantity: number;
  status: string;
  customer_name?: string;
  customer_email?: string;
}

export type RequestedItem = any;


// ============================================================================
// FORM INPUT SCHEMAS
// ============================================================================

export const loginInputSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerObjectSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(6, "Phone is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  re_password: z.string(),
  role: z.enum(["CLIENT", "ADMIN", "VENDOR"]),
}).refine((data) => data.password === data.re_password, {
  message: "Passwords don't match",
  path: ["re_password"],
});

export type RegisterInput = z.infer<typeof registerObjectSchema>;

export const setPasswordInputSchema = z.object({
  uidb64: z.string(),
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  re_password: z.string(),
}).refine((data) => data.password === data.re_password, {
  message: "Passwords don't match",
  path: ["re_password"],
});

export type SetPasswordInput = z.infer<typeof setPasswordInputSchema>;

export const createServiceInputSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  service_type: z.string(),
  base_price: z.number().min(0),
  location: z.string().or(z.number()).optional(),
  user: z.string().or(z.number()).optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

export const createVendorInputSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  phone_number: z.string(),
  bio: z.string().optional().or(z.literal("")),
  business_name: z.string().min(2, "Business name is required"),
  vendor_type: z.enum(["hotel", "car_rental", "guide", "experience", "transport", "other"]),
  address: z.string().min(1, "Address is required"),
  website: z.string().url().optional().or(z.literal("")).or(z.null()),
});

export type CreateVendorInput = z.infer<typeof createVendorInputSchema>;

