"use server";

import { unstable_cache } from "next/cache";
import type { User } from "@/types";
import type { Booking } from "@/lib/schema/booking-schema";
import type { ServiceResponse } from "@/lib/schema/service-schema";
import type { VendorResponse } from "@/lib/schema/vendor-schema";
import { endpoints } from "@/actions/endpoints";
import { api } from "@/lib/api/client";

export const getRequests = async (): Promise<Booking[]> => {
  try {
    const data = await api.get<Booking[]>(
      endpoints.bookings.admin.list,
      undefined,
      {
        requiresAuth: true,
        next: {
          revalidate: 60,
          tags: ["requests"],
        },
      },
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    return [];
  }
};

export const getRequestById = async (id: string): Promise<Booking | null> => {
  try {
    const data = await api.get<Booking>(
      endpoints.bookings.admin.detail(id),
      undefined,
      {
        requiresAuth: true,
        cache: "no-store",
      },
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch request ${id}:`, error);
    return null;
  }
};

const cachedGetUsers = unstable_cache(
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

export const getUsers = async () => cachedGetUsers();

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

export const getServiceById = async (
  id: string,
): Promise<ServiceResponse | null> => {
  try {
    const data = await api.get<ServiceResponse>(
      endpoints.services.details(id),
      undefined,
      {
        cache: "no-store",
      },
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch service ${id}:`, error);
    return null;
  }
};

export const getVendors = async (): Promise<VendorResponse[]> => {
  try {
    const data = await api.get<VendorResponse[]>(
      endpoints.vendors.list,
      undefined,
      {
        next: {
          revalidate: 3600,
          tags: ["vendors"],
        },
      },
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return [];
  }
};

export const getVendorById = async (
  id: string,
): Promise<VendorResponse | null> => {
  try {
    const data = await api.get<VendorResponse>(
      endpoints.vendors.details(id),
      undefined,
      {
        cache: "no-store",
      },
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch vendor ${id}:`, error);
    return null;
  }
};
