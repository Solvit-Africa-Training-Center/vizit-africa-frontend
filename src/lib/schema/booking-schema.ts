import { z } from "zod";

export const addCartItemInputSchema = z.object({
  service: z.number().or(z.string()),
  start_date: z.string(),
  end_date: z.string(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
});

export type AddCartItemInput = z.infer<typeof addCartItemInputSchema>;

export const addCartItemResponseSchema = z.object({
  id: z.number().or(z.string()),
  service: z.number().or(z.string()),
  quantity: z.number(),
  total_price: z.coerce.number(),
});

export type AddCartItemResponse = z.infer<typeof addCartItemResponseSchema>;

export const confirmBookingResponseSchema = z.object({
  id: z.string().or(z.number()),
  status: z.string().optional(),
  currency: z.string().optional(),
});

export type ConfirmBookingResponse = z.infer<
  typeof confirmBookingResponseSchema
>;

export const generateTicketResponseSchema = z.object({
  ticket_url: z.string().url(),
  qr_code: z.string().optional(),
});

export type GenerateTicketResponse = z.infer<
  typeof generateTicketResponseSchema
>;

export const verifyTicketInputSchema = z.object({
  qr_code_data: z.string(),
});

export type VerifyTicketInput = z.infer<typeof verifyTicketInputSchema>;

export const verifyTicketResponseSchema = z.object({
  visited: z.boolean(),
  booking_details: z
    .object({
      id: z.string().or(z.number()),
      user: z.string().optional(),
      service_name: z.string().optional(),
    })
    .optional(),
  valid: z.boolean(),
});

export type VerifyTicketResponse = z.infer<typeof verifyTicketResponseSchema>;

export const adminActionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type AdminActionResponse = z.infer<typeof adminActionResponseSchema>;

// booking item — service and dates are optional for custom items
export const bookingItemSchema = z.object({
  id: z.string().or(z.number()),
  service: z.string().or(z.number()).nullable().optional(),
  item_type: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  is_round_trip: z.boolean().optional(),
  return_date: z.string().nullable().optional(),
  quantity: z.number(),
  unit_price: z.coerce.number(),
  subtotal: z.coerce.number(),
  status: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string(),
});

export type BookingItem = z.infer<typeof bookingItemSchema>;

// quote item inside packageQuote
const quoteItemSchema = z.object({
  id: z.string().optional(),
  service: z.string().optional(),
  service_id: z.string().optional(),
  type: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unit_price: z.coerce.number().optional(),
  line_total: z.coerce.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const packageQuoteSchema = z.object({
  status: z.string(),
  sent_at: z.string().optional(),
  sent_by: z.string().optional(),
  currency: z.string().optional(),
  total_amount: z.coerce.number().optional(),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).optional(),
  expires_at: z.string().optional(),
  accepted_at: z.string().optional(),
});

// matches enriched BookingSerializer response
export const bookingSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  arrivalDate: z.string().nullable().optional(),
  departureDate: z.string().nullable().optional(),
  travelers: z.number(),
  adults: z.number(),
  children: z.number(),
  infants: z.number(),
  needsFlights: z.boolean(),
  needsHotel: z.boolean(),
  needsCar: z.boolean(),
  needsGuide: z.boolean(),
  status: z.string(),
  currency: z.string(),
  total_amount: z.coerce.number(),
  specialRequests: z.string().optional(),
  tripPurpose: z.string().optional(),
  items: z.array(bookingItemSchema),
  quote: packageQuoteSchema.nullable().optional(),
  createdAt: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const bookingListSchema = z.array(bookingSchema);

export type BookingList = z.infer<typeof bookingListSchema>;
