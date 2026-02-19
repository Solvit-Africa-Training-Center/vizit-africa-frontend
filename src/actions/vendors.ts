"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";
import type { ActionResult, ApiError } from "@/lib/api/types";
import {
  type CreateVendorInput,
  createVendorInputSchema,
  type VendorResponse,
  vendorResponseSchema,
} from "@/lib/schema/vendor-schema";
import {
  buildValidationErrorMessage,
  normalizeFieldErrors,
} from "@/lib/validation/error-message";
import { endpoints } from "./endpoints";

export async function createVendorProfile(
  input: CreateVendorInput,
): Promise<ActionResult<VendorResponse>> {
  const validation = createVendorInputSchema.safeParse(input);
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
      endpoints.vendors.create,
      validation.data,
      vendorResponseSchema,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function updateVendor(
  vendorId: string | number,
  input: CreateVendorInput,
): Promise<ActionResult<VendorResponse>> {
  const validation = createVendorInputSchema.safeParse(input);
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
    const data = await api.put(
      endpoints.vendors.details(vendorId),
      validation.data,
      vendorResponseSchema,
    );
    revalidatePath("/inventory");
    revalidatePath(`/admin/vendors/${vendorId}/edit`);
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message, fieldErrors: err.fieldErrors };
  }
}

export async function approveVendor(
  vendorId: string | number,
): Promise<ActionResult<{ success: boolean; message: string }>> {
  try {
    await api.post(endpoints.vendors.approve(vendorId), {}, undefined);
    revalidatePath("/admin/vendors");
    return {
      success: true,
      data: { success: true, message: "Vendor approved" },
    };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}

export async function getVendors(): Promise<ActionResult<VendorResponse[]>> {
  try {
    const data = await api.get<VendorResponse[]>(
      endpoints.vendors.list,
      undefined,
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}

export async function deleteVendor(
  vendorId: string | number,
): Promise<ActionResult<{ success: boolean; message: string }>> {
  try {
    await api.delete(endpoints.vendors.details(vendorId));
    revalidatePath("/admin/vendors");
    revalidatePath("/inventory");
    return {
      success: true,
      data: { success: true, message: "Vendor deleted successfully" },
    };
  } catch (error) {
    const err = error as ApiError;
    return { success: false, error: err.message };
  }
}
