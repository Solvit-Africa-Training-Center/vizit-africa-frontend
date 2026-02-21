"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api/simple-client";
import { endpoints } from "./endpoints";
import { serviceSchema } from "@/lib/unified-types";
import type { Service, ActionResult } from "@/lib/unified-types";

export type { ActionResult };

export async function createService(
  input: Record<string, any>,
): Promise<ActionResult<Service>> {
  try {
    const data = await api.post(
      endpoints.services.create,
      input,
      serviceSchema,
    );
    revalidatePath("/admin/services");
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        fieldErrors: error.details as Record<string, string[]> | undefined,
      };
    }
    return { success: false, error: "Failed to create service" };
  }
}

export async function getServiceList(): Promise<ActionResult<Service[]>> {
  try {
    const data = await api.get<Service[]>(endpoints.services.list);
    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to fetch services",
    };
  }
}

export async function updateService(
  id: string | number,
  input: Record<string, any>,
): Promise<ActionResult<Service>> {
  try {
    const data = await api.put(
      endpoints.services.details(id),
      input,
      serviceSchema,
    );
    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}/edit`);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        fieldErrors: error.details as Record<string, string[]> | undefined,
      };
    }
    return { success: false, error: "Failed to update service" };
  }
}

export async function deleteService(
  id: string | number,
): Promise<ActionResult<{ message: string }>> {
  try {
    await api.delete(endpoints.services.details(id));
    revalidatePath("/admin/services");
    revalidatePath("/admin/inventory");
    return { success: true, data: { message: "Service deleted successfully" } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to delete service",
    };
  }
}
