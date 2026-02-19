"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";
import type { ActionResult, ApiError } from "@/lib/api/types";
import {
  type CreateLocationInput,
  createLocationInputSchema,
  type LocationResponse,
  locationResponseSchema,
} from "@/lib/schema/location-schema";
import {
  buildValidationErrorMessage,
  normalizeFieldErrors,
} from "@/lib/validation/error-message";
import { endpoints } from "./endpoints";

export async function createLocation(
  input: CreateLocationInput,
): Promise<ActionResult<LocationResponse>> {
  const validation = createLocationInputSchema.safeParse(input);
  if (!validation.success) {
    const flattened = validation.error.flatten();
    const fieldErrors = normalizeFieldErrors(flattened.fieldErrors);
    return {
      success: false,
      error: buildValidationErrorMessage({
        fieldErrors,
        formErrors: flattened.formErrors,
      }),
      fieldErrors,
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

export async function getLocations(): Promise<
  ActionResult<LocationResponse[]>
> {
  try {
    const data = await api.get<LocationResponse[]>(endpoints.locations.list);
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}
