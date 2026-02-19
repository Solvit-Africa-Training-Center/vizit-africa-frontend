import { z } from "zod";

// create vendor
export const createVendorInputSchema = z.object({
  business_name: z.string().min(2),
  vendor_type: z.enum([
    "tour_operator",
    "transport_provider",
    "accommodation_provider",
    "guide",
    "individual",
    "company",
  ]),
  description: z.string(),
  contact_phone: z.string(),
  address: z.string(),
  website: z.string(),
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
