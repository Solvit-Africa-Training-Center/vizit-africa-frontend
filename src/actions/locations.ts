"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api/simple-client";
import { locationSchema } from "@/lib/unified-types";
import { endpoints } from "./endpoints";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createLocation(input: unknown): Promise<ActionResult<any>> {
  try {
    const data = await api.post(endpoints.locations.create, input, locationSchema);
    revalidatePath("/locations");
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}

export async function getLocations(): Promise<ActionResult<any[]>> {
  try {
    const data = await api.get(endpoints.locations.list);
    return { success: true, data: (data || []) as any[] };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An error occurred" };
  }
}
