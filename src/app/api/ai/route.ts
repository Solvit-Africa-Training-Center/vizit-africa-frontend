import { google } from "@ai-sdk/google";
import { Output, streamText } from "ai";
import { z } from "zod";

const aiTripRequestSchema = z.object({
  destination: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  groupSize: z.number().int().positive(),
  tripPurpose: z.string().optional(),
  specialRequests: z.string().optional(),
  budgetHint: z.number().nonnegative().optional(),
});

const hotelSchema = z.object({
  id: z.string(),
  name: z.string(),
  stars: z.number().min(1).max(5),
  rating: z.number().min(0).max(5),
  pricePerNight: z.number().nonnegative(),
  location: z.string(),
  address: z.string(),
  amenities: z.array(z.string()),
  image: z.string().optional(),
});

const carSchema = z.object({
  id: z.string(),
  model: z.string(),
  category: z.enum(["sedan", "suv", "van"]),
  pricePerDay: z.number().nonnegative(),
  seats: z.number().int().positive(),
  transmission: z.string(),
  fuelType: z.string(),
  features: z.array(z.string()),
  image: z.string().optional(),
  withDriver: z.boolean().optional(),
});

const guideSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string(),
  price: z.number().nonnegative(),
  image: z.string().optional(),
});

const tripRecommendationsSchema = z.object({
  destination: z.string(),
  itinerarySummary: z.string(),
  totalEstimatedBudget: z.number().nonnegative(),
  hotels: z.array(hotelSchema),
  cars: z.array(carSchema),
  guides: z.array(guideSchema),
});

function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = aiTripRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error:
            parsed.error.flatten().formErrors[0] ??
            "Invalid request payload for AI trip recommendations.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      destination,
      startDate,
      endDate,
      groupSize,
      tripPurpose,
      specialRequests,
      budgetHint,
    } = parsed.data;

    const nights = calculateNights(startDate, endDate);

    const result = streamText({
      model: google("gemini-3-flash-preview"),
      output: Output.object({
        schema: tripRecommendationsSchema,
      }),
      prompt: `You are a travel planning assistant for Rwanda trips.

Return a structured recommendation object for a trip with:
- Destination: ${destination}
- Dates: ${startDate} to ${endDate} (${nights} nights)
- Group size: ${groupSize}
- Trip purpose: ${tripPurpose || "general"}
- Budget hint (USD): ${budgetHint ?? "not provided"}
- Special requests: ${specialRequests || "none"}

Requirements:
1) Provide exactly 3 hotels, 3 cars, and 2 guides.
2) Keep prices realistic and aligned with the budget hint.
3) Focus recommendations around the destination context.
4) Keep the itinerarySummary concise (2-4 sentences).
5) Return only valid fields from the schema.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    const err = error as Record<string, unknown>;
    const isRateLimit =
      err.statusCode === 429 ||
      err.status === 429 ||
      String(err.message).includes("429") ||
      String(err.message).includes("quota");

    if (isRateLimit) {
      return Response.json(
        {
          error:
            "Our AI travel planner is currently busy. Please try again in 30 seconds.",
        },
        { status: 429 },
      );
    }

    return Response.json(
      { error: "Failed to generate AI recommendations." },
      { status: 500 },
    );
  }
}
