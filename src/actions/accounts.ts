"use server";

import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import { revalidatePath } from "next/cache";

export interface SavedItem {
  id: string;
  created_at: string;
  object_id: string;
  content_object: {
    id: string;
    type: string;
    title: string;
    description?: string;
    image?: string;
  };
}

export async function getSavedItems() {
  try {
    const data = await api.get(endpoints.accounts.savedItems.list);
    return { success: true, data: data as SavedItem[] };
  } catch (error) {
    return { success: false, error: "Failed to fetch saved items" };
  }
}

export async function saveItem(type: string, id: string) {
  try {
    const data = await api.post(endpoints.accounts.savedItems.create, {
      type,
      id,
    });
    revalidatePath("/profile");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Failed to save item" };
  }
}

export async function removeItem(type: string, id: string) {
  try {
    const data = await api.post(endpoints.accounts.savedItems.remove, {
      type,
      id,
    });
    revalidatePath("/profile");
    return { success: true, data };
  } catch (error) {
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
    return { success: false, error: "Failed to send message" };
  }
}
