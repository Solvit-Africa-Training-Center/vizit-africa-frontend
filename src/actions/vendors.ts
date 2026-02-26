"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api/simple-client";
import { vendorSchema, type ActionResult, type Vendor, type CreateVendorInput, type VendorRequest } from "@/lib/unified-types";
import { endpoints } from "./endpoints";

export async function createVendorProfile(
  input: CreateVendorInput,
): Promise<ActionResult<Vendor>> {
  try {
    const data = await api.post(endpoints.vendors.create, input, vendorSchema);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function registerVendor(
  input: CreateVendorInput,
): Promise<ActionResult<Vendor>> {
  try {
    const data = await api.post(
      endpoints.vendors.register,
      input,
      vendorSchema,
    );
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function updateVendor(
  vendorId: string | number,
  input: Partial<CreateVendorInput>,
): Promise<ActionResult<Vendor>> {
  try {
    const data = await api.put(
      endpoints.vendors.detail(vendorId),
      input,
      vendorSchema,
    );
    revalidatePath("/inventory");
    revalidatePath(`/admin/vendors/${vendorId}/edit`);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function approveVendor(
  vendorId: string | number,
): Promise<ActionResult<Vendor>> {
  try {
    const data = await api.post(endpoints.vendors.approve(vendorId), {}, vendorSchema);
    revalidatePath("/admin/vendors");
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function getVendors(): Promise<ActionResult<Vendor[]>> {
  try {
    const data = await api.get<Vendor[]>(endpoints.vendors.list);
    return { success: true, data: data || [] };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function deleteVendor(
  vendorId: string | number,
): Promise<ActionResult<{ success: boolean; message: string }>> {
  try {
    await api.delete(endpoints.vendors.detail(vendorId));
    revalidatePath("/admin/vendors");
    revalidatePath("/inventory");
    return {
      success: true,
      data: { success: true, message: "Vendor deleted successfully" },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function getVendorDashboardStats(): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const data = await api.get<Record<string, unknown>>(endpoints.vendors.dashboard);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function getVendorRequests(): Promise<ActionResult<VendorRequest[]>> {
  try {
    const data = await api.get<VendorRequest[]>(endpoints.vendors.requests);
    return { success: true, data: data || [] };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function checkVendorServiceAvailability(
  serviceId: string | number,
  startDate: string,
  endDate: string,
  quantity: number,
): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const data = await api.post<Record<string, unknown>>(endpoints.services.checkAvailability, {
      serviceId,
      startDate,
      endDate,
      quantity,
    });
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function confirmVendorRequest(
  requestId: string | number,
): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const data = await api.post<Record<string, unknown>>(endpoints.vendors.confirmItem(requestId), {});
    revalidatePath("/vendor/dashboard");
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}
