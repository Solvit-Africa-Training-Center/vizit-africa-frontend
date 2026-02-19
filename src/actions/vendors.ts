"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import {
  type CreateVendorInput,
  type VendorResponse,
  createVendorInputSchema,
  vendorResponseSchema,
} from "@/lib/schema/vendor-schema";

export async function createVendorProfile(
  input: CreateVendorInput,
): Promise<ActionResult<VendorResponse>> {
  const validation = createVendorInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
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
