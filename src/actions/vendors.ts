"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api/simple-client";
import { vendorSchema } from "@/lib/unified-types";
import { endpoints } from "./endpoints";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createVendorProfile(input: unknown): Promise<ActionResult<any>> {
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

export async function registerVendor(input: unknown): Promise<ActionResult<any>> {
  try {
    const data = await api.post(endpoints.vendors.register, input, vendorSchema);
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
  input: unknown,
): Promise<ActionResult<any>> {
  try {
    const data = await api.put(
      endpoints.vendors.details(vendorId),
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

export async function approveVendor(vendorId: string | number): Promise<ActionResult<any>> {
  try {
    const data = await api.post(endpoints.vendors.approve(vendorId), {});
    revalidatePath("/admin/vendors");
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function getVendors(): Promise<ActionResult<any[]>> {
  try {
    const data = await api.get(endpoints.vendors.list);
    return { success: true, data: (data || []) as any[] };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function deleteVendor(vendorId: string | number): Promise<ActionResult<any>> {
  try {
    await api.delete(endpoints.vendors.details(vendorId));
    revalidatePath("/admin/vendors");
    revalidatePath("/inventory");
    return { success: true, data: { success: true, message: "Vendor deleted successfully" } };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function getVendorDashboardStats(): Promise<ActionResult<any>> {
  try {
    const data = await api.get(endpoints.vendors.dashboard);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function getVendorRequests(): Promise<ActionResult<any[]>> {
  try {
    const data = await api.get(endpoints.vendors.requests);
    return { success: true, data: (data || []) as any[] };
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
): Promise<ActionResult<any>> {
  try {
    const data = await api.post(endpoints.services.checkAvailability, {
      service_id: serviceId,
      start_date: startDate,
      end_date: endDate,
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
): Promise<ActionResult<any>> {
  try {
    const data = await api.post(endpoints.vendors.confirmItem(requestId), {});
    revalidatePath("/vendor/dashboard");
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}
