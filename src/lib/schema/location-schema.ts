import { z } from "zod";

export const createLocationInputSchema = z.object({
  name: z.string().min(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreateLocationInput = z.infer<typeof createLocationInputSchema>;

export const locationResponseSchema = createLocationInputSchema.extend({
  id: z.number().or(z.string()),
  created_at: z.string().optional(),
});

export type LocationResponse = z.infer<typeof locationResponseSchema>;
