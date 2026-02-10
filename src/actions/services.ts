"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import {
  type CreateServiceInput,
  type ServiceResponse,
  type AddServiceMediaInput,
  type ServiceMediaResponse,
  type CreateAvailabilityInput,
  type AvailabilityResponse,
  type CreateDiscountInput,
  type DiscountResponse,
  createServiceInputSchema,
  serviceResponseSchema,
  addServiceMediaInputSchema,
  serviceMediaResponseSchema,
  createAvailabilityInputSchema,
  availabilityResponseSchema,
  createDiscountInputSchema,
  discountResponseSchema,
} from "@/lib/schema/service-schema";

export async function createService(
  input: CreateServiceInput,
): Promise<ActionResult<ServiceResponse>> {
  const validation = createServiceInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.services.create,
      validation.data,
      serviceResponseSchema,
    );
    revalidatePath("/services");
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function addServiceMedia(
  input: AddServiceMediaInput,
): Promise<ActionResult<ServiceMediaResponse>> {
  const validation = addServiceMediaInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.services.media,
      validation.data,
      serviceMediaResponseSchema,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function createAvailability(
  input: CreateAvailabilityInput,
): Promise<ActionResult<AvailabilityResponse>> {
  const validation = createAvailabilityInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.services.availability,
      validation.data,
      availabilityResponseSchema,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function createDiscount(
  input: CreateDiscountInput,
): Promise<ActionResult<DiscountResponse>> {
  const validation = createDiscountInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.services.discounts,
      validation.data,
      discountResponseSchema,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}
