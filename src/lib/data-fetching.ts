import { unstable_cache } from "next/cache";
import { sampleRequests, users } from "@/lib/dummy-data";
import type { Request, User } from "@/lib/schemas";

const SIMULATED_DELAY = 1000;

import { api } from "@/lib/api/client";

export const getRequests = async (): Promise<Request[]> => {
  try {
    const data = await api.get<Request[]>("/bookings/admin/bookings/", undefined, {
      requiresAuth: true,
      next: {
        revalidate: 60,
        tags: ["requests"],
      },
    } as any);
    return data;
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    return [];
  }
};

export const getRequestById = async (id: string): Promise<Request | null> => {
  try {
    const data = await api.get<Request>(`/bookings/admin/bookings/${id}/`, undefined, {
      requiresAuth: true,
      cache: "no-store",
    } as any);
    return data;
  } catch (error) {
    console.error(`Failed to fetch request ${id}:`, error);
    return null;
  }
};

export const getUsers = unstable_cache(
  async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));
    return users;
  },
  ["users"],
  {
    revalidate: 3600,
    tags: ["users"],
  },
);
