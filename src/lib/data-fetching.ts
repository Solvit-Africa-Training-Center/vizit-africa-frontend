import { unstable_cache } from "next/cache";
import type { Booking, User } from "@/types";
import type { ServiceResponse } from "@/lib/schema/service-schema";
import { endpoints } from "@/actions/endpoints";
import { api } from "@/lib/api/client";

export const getRequests = async (): Promise<Booking[]> => {
  try {
    const data = await api.get<Booking[]>(endpoints.bookings.admin.list, undefined, {
      requiresAuth: true,
      next: {
        revalidate: 60,
        tags: ["requests"],
      },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    return [];
  }
};

export const getRequestById = async (id: string): Promise<Booking | null> => {
  try {
    const data = await api.get<Booking>(endpoints.bookings.admin.detail(id), undefined, {
      requiresAuth: true,
      cache: "no-store",
    });
    return data;
  } catch (error) {
    console.error(`Failed to fetch request ${id}:`, error);
    return null;
  }
};

export const getUsers = unstable_cache(
  async (): Promise<User[]> => {
    try {
      const data = await api.get<User[]>(endpoints.auth.list, undefined, {
        requiresAuth: true,
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  },
  ["users"],
  {
    revalidate: 3600,
    tags: ["users"],
  },
);

export const getServices = async (
  category?: string,
): Promise<ServiceResponse[]> => {
  try {
    const url = category
      ? `${endpoints.services.list}?service_type=${category}`
      : endpoints.services.list;
    const data = await api.get<ServiceResponse[]>(url, undefined, {
      next: {
        revalidate: 3600,
        tags: ["services"],
      },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};
