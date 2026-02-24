/**
 * Simplified API Client
 * Handles all HTTP requests with consistent error/response handling
 */

import { cookies as getCookies } from "next/headers";
import { type ZodSchema } from "zod";
import { endpoints } from "@/actions/endpoints";
import type { ApiResponse } from "@/lib/unified-types";
import { ApiError } from "@/lib/api/error";
import { logger } from "@/lib/utils/logger";

export { ApiError } from "@/lib/api/error";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://linguistic-murial-adventist-university-of-central-afri-7975ce32.koyeb.app/api";

const IS_DEV = process.env.NODE_ENV !== "production";

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

async function getAuthToken() {
  const cookieStore = await getCookies();
  return cookieStore.get("accessToken")?.value;
}

async function refreshAccessToken() {
  const cookieStore = await getCookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}${endpoints.auth.refresh}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const newToken = data.access || data.data?.access;

    if (newToken) {
      cookieStore.set("accessToken", newToken, COOKIE_OPTIONS);
      if (data.refresh || data.data?.refresh) {
        cookieStore.set(
          "refreshToken",
          data.refresh || data.data.refresh,
          COOKIE_OPTIONS,
        );
      }
    }

    return newToken;
  } catch {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return null;
  }
}

/**
 * Handle API response
 * Supports both new unified format and legacy formats
 */
async function handleResponse<T>(
  response: Response,
  schema?: ZodSchema<T>,
): Promise<T> {
  const responseText = await response.text();
  let responseData: any = null;

  // Parse JSON if possible
  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = null;
    }
  }

  // Handle non-OK responses
  if (!response.ok) {
    let message = "Request failed";
    let code = `ERROR_${response.status}`;
    let details: Record<string, unknown> | undefined;

    if (responseData) {
      // New unified format
      if ("error" in responseData && responseData.error) {
        message = responseData.error.message || message;
        code = responseData.error.code || code;
        details = responseData.error.details;
      }
      // Legacy formats
      else if (responseData.message) {
        message = responseData.message;
      } else if (responseData.detail) {
        message = responseData.detail;
      }

      // Extract validation errors from legacy format
      if (!details && typeof responseData === "object") {
        const possibleErrors = Object.fromEntries(
          Object.entries(responseData).filter(
            ([key]) =>
              !["success", "message", "detail", "status", "error"].includes(
                key,
              ),
          ),
        );
        if (Object.keys(possibleErrors).length > 0) {
          details = possibleErrors;
        }
      }
    }

    if (IS_DEV) {
      logger.error(`[API Error] ${code}: ${message}`, { details });
    }

    throw new ApiError(message, response.status, details);
  }

  // Handle 204 No Content
  if (response.status === 204 || !responseText) {
    return {} as T;
  }

  // Validate with schema if provided
  if (schema && responseData) {
    const validated = schema.safeParse(responseData);
    if (!validated.success) {
      if (IS_DEV) {
        logger.warn(
          "[Schema Validation Warning] The API response did not exactly match the expected schema:",
          { errors: validated.error.flatten(), rawData: responseData }
        );
      }
      // Return raw data instead of throwing so the app can gracefully continue
      return responseData as T;
    }
    return validated.data;
  }

  return responseData as T;
}

interface FetchOptions<T = any> extends RequestInit {
  schema?: ZodSchema<T>;
  requiresAuth?: boolean;
  _retry?: boolean;
}

/**
 * Main fetch function
 */
async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions<T> = {},
): Promise<T> {
  const {
    schema,
    requiresAuth = true,
    headers = {},
    _retry = false,
    ...rest
  } = options;

  // Get auth token if needed
  const token = requiresAuth ? await getAuthToken() : undefined;

  // Build headers
  const headersMap = new Headers(headers);
  if (token) {
    headersMap.set("Authorization", `Bearer ${token}`);
  }

  // Set content type if not FormData
  if (
    rest.body &&
    !(rest.body instanceof FormData) &&
    !headersMap.has("Content-Type")
  ) {
    headersMap.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      headers: headersMap,
    });

    return await handleResponse<T>(response, schema);
  } catch (error) {
    // Auto-retry on 401 with token refresh
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      !_retry &&
      requiresAuth
    ) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return apiFetch<T>(endpoint, {
          ...options,
          _retry: true,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        });
      }
    }

    throw error instanceof ApiError
      ? error
      : new ApiError("Network error", 500);
  }
}

/**
 * Public API object
 */
export const api = {
  get: <T>(
    endpoint: string,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions, "method">,
  ) => apiFetch<T>(endpoint, { ...options, method: "GET", schema }),

  post: <T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions, "method" | "body">,
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
      schema,
    }),

  put: <T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions, "method" | "body">,
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
      schema,
    }),

  patch: <T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions, "method" | "body">,
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
      schema,
    }),

  delete: <T>(
    endpoint: string,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions, "method">,
  ) => apiFetch<T>(endpoint, { ...options, method: "DELETE", schema }),

  postFormData: <T>(
    endpoint: string,
    formData: FormData,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions, "method" | "body">,
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      schema,
    }),
};
