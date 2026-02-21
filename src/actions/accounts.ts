"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api/simple-client";
import { endpoints } from "./endpoints";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getSavedItems() {
  try {
    const data = await api.get(endpoints.accounts.savedItems.list);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to fetch saved items" };
  }
}

export async function saveItem(type: string, id: string) {
  try {
    const data = await api.post(endpoints.accounts.savedItems.create, { type, id });
    revalidatePath("/profile");
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to save item" };
  }
}

export async function removeItem(type: string, id: string) {
  try {
    const data = await api.post(endpoints.accounts.savedItems.remove, { type, id });
    revalidatePath("/profile");
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to remove item" };
  }
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}) {
  try {
    const data = await api.post(endpoints.accounts.contact, payload);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to send message" };
  }
}
