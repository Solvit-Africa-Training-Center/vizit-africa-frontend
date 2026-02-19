import { z } from "zod";

// create vendor
export const createVendorInputSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  phone_number: z.string(),
  bio: z.string(),
  business_name: z.string().min(2),
  vendor_type: z.enum([
    "hotel",
    "car_rental",
    "guide",
    "experience",
    "transport",
    "other",
  ]),
  address: z.string(),
  website: z.string().url().or(z.literal("")),
});

export type CreateVendorInput = z.infer<typeof createVendorInputSchema>;

export const vendorResponseSchema = createVendorInputSchema.extend({
  id: z.number().or(z.string()),
  user: z.number().or(z.string()).optional(),
  status: z.string(),
  is_approved: z.boolean(),
  created_at: z.string().optional(),
});

export type VendorResponse = z.infer<typeof vendorResponseSchema>;
