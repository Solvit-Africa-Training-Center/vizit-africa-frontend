import { z } from "zod";

// create service
export const createServiceInputSchema = z.object({
  title: z.string().min(3),
  service_type: z.enum(["tour", "accommodation", "transport", "experience"]),
  description: z.string().min(10),
  base_price: z.number().min(0),
  currency: z.string(),
  capacity: z.number().min(1),
  status: z.enum(["active", "inactive", "draft"]),
  location: z.number().or(z.string()), // Location ID
  vendor: z.number().or(z.string()), // Vendor ID
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

export const serviceResponseSchema = createServiceInputSchema.extend({
  id: z.number().or(z.string()),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type ServiceResponse = z.infer<typeof serviceResponseSchema>;

// add service media
export const addServiceMediaInputSchema = z.object({
  service: z.number().or(z.string()),
  media_url: z.string().url(),
  media_type: z.enum(["image", "video"]),
  sort_order: z.number().optional(),
});

export type AddServiceMediaInput = z.infer<typeof addServiceMediaInputSchema>;

export const serviceMediaResponseSchema = addServiceMediaInputSchema.extend({
  id: z.number().or(z.string()),
});

export type ServiceMediaResponse = z.infer<typeof serviceMediaResponseSchema>;

// create availability
export const createAvailabilityInputSchema = z.object({
  service: z.number().or(z.string()),
  start_date: z.string(),
  end_date: z.string(),
  available_quantity: z.number().min(0),
  price_override: z.number().optional(),
  is_blocked: z.boolean().default(false),
});

export type CreateAvailabilityInput = z.infer<
  typeof createAvailabilityInputSchema
>;

export const availabilityResponseSchema = createAvailabilityInputSchema.extend({
  id: z.number().or(z.string()),
});

export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;

// create discount
export const createDiscountInputSchema = z.object({
  code: z.string().min(3).max(20),
  name: z.string(),
  description: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().min(0),
  start_date: z.string(),
  end_date: z.string(),
  is_active: z.boolean().default(true),
});

export type CreateDiscountInput = z.infer<typeof createDiscountInputSchema>;

export const discountResponseSchema = createDiscountInputSchema.extend({
  id: z.number().or(z.string()),
});

export type DiscountResponse = z.infer<typeof discountResponseSchema>;
