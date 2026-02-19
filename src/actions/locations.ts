"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import {
  type CreateLocationInput,
  type LocationResponse,
  createLocationInputSchema,
  locationResponseSchema,
} from "@/lib/schema/location-schema";

export async function createLocation(
  input: CreateLocationInput,
): Promise<ActionResult<LocationResponse>> {
  const validation = createLocationInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.locations.create,
      validation.data,
      locationResponseSchema,
    );
    revalidatePath("/locations");
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function getLocations(): Promise<ActionResult<LocationResponse[]>> {
  try {
    const data = await api.get<LocationResponse[]>(endpoints.locations.list);
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}
