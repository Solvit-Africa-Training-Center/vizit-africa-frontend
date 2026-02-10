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
  total_price: z.number(),
});

export type AddCartItemResponse = z.infer<typeof addCartItemResponseSchema>;

// confirm booking
export const confirmBookingResponseSchema = z.object({
  booking_id: z.string().or(z.number()),
  status: z.string(),
  message: z.string().optional(),
});

export type ConfirmBookingResponse = z.infer<
  typeof confirmBookingResponseSchema
>;

// generate tickets
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

// admin action response
export const adminActionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type AdminActionResponse = z.infer<typeof adminActionResponseSchema>;
