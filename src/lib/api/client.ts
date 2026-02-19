import { cookies } from "next/headers";
import { type ZodSchema, z } from "zod";
import { endpoints } from "@/actions/endpoints";
import { buildValidationErrorMessage } from "@/lib/validation/error-message";
import type { FieldErrors } from "./types";
import { ApiError } from "./types";

type FetchOptions<T = any> = RequestInit & {
  schema?: ZodSchema<T>;
  requiresAuth?: boolean;
  _retry?: boolean;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://linguistic-murial-adventist-university-of-central-afri-7975ce32.koyeb.app/api";
const IS_DEV = process.env.NODE_ENV !== "production";
const GENERIC_VALIDATION_MESSAGES = new Set([
  "validation failed",
  "invalid input",
  "invalid data",
  "bad request",
]);

function isGenericValidationMessage(message: string): boolean {
  const normalized = message.trim().toLowerCase().replace(/[.!]+$/, "");
  return GENERIC_VALIDATION_MESSAGES.has(normalized);
}

function normalizeApiFieldErrors(value: unknown): FieldErrors | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const normalized: FieldErrors = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (Array.isArray(entry)) {
      const messages = entry.filter(
        (item): item is string =>
          typeof item === "string" && Boolean(item.trim()),
      );
      if (messages.length > 0) {
        normalized[key] = messages;
      }
      continue;
    }

    if (typeof entry === "string" && entry.trim()) {
      normalized[key] = [entry];
      continue;
    }

    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const nested = normalizeApiFieldErrors(entry);
      if (nested) {
        const nestedMessages = Object.values(nested).flat();
        if (nestedMessages.length > 0) {
          normalized[key] = nestedMessages;
        }
      }
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

async function refreshAccessToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}${endpoints.auth.refresh}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    const data = await response.json();

    // Update cookies
    cookieStore.set("accessToken", data.access, COOKIE_OPTIONS);
    if (data.refresh) {
      cookieStore.set("refreshToken", data.refresh, COOKIE_OPTIONS);
    }

    return data.access;
  } catch {
    // Clear cookies on failure
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return null;
  }
}

async function handleResponse<T>(
  response: Response,
  schema?: ZodSchema<T>,
): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    let fieldErrors: FieldErrors | undefined;

    try {
      const errorData = await response.json();
      if (IS_DEV) {
        console.log(
          "[Client] Raw Error Response:",
          JSON.stringify(errorData, null, 2),
        );
      }

      const extractedFieldErrors = normalizeApiFieldErrors(
        errorData.errors || errorData.fieldErrors || errorData,
      );

      // Handle standardized backend error format: { status: "error", message: "...", errors: {...} }
      if (errorData.status === "error") {
        errorMessage = errorData.message || errorData.detail || errorMessage;
        fieldErrors = extractedFieldErrors;
      } else {
        // Fallback for legacy/other structures
        errorMessage = errorData.detail || errorData.message || errorMessage;
        fieldErrors = extractedFieldErrors;

        // If the error data itself is an object of field errors (common in DRF)
        if (
          typeof errorData === "object" &&
          !errorData.detail &&
          !errorData.message &&
          !errorData.status
        ) {
          errorMessage = buildValidationErrorMessage({
            fieldErrors,
            fallback: "Please review the form fields.",
          });
        }
      }

      if (
        fieldErrors &&
        (!errorMessage.trim() || isGenericValidationMessage(errorMessage))
      ) {
        errorMessage = buildValidationErrorMessage({
          fieldErrors,
          fallback: "Please review the form fields.",
        });
      }

      if (IS_DEV && fieldErrors) {
        console.log("[Client] Extracted Field Errors:", fieldErrors);
      }
    } catch (e) {
      if (IS_DEV) {
        console.error("Error parsing error response:", e);
      }
    }

    throw new ApiError(errorMessage, response.status, fieldErrors);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    const data = await response.json();
    if (schema) {
      return schema.parse(data);
    }
    return data as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation Error:", error.flatten());
      throw new ApiError("Response validation failed", 500);
    }
    throw error;
  }
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions<T> = {},
): Promise<T> {
  const { schema, requiresAuth = true, headers = {}, ...rest } = options;

  const token = requiresAuth ? await getAuthToken() : undefined;

  const headersMap = new Headers(headers);
  if (token) {
    headersMap.set("Authorization", `Bearer ${token}`);
  }

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
    // Token refresh logic for 401 errors
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      !options._retry &&
      requiresAuth
    ) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry with new token
        return apiFetch<T>(endpoint, {
          ...options,
          _retry: true,
          // Explicitly set authorization header for retry since getAuthToken might still see old cookie?
          // Actually, apiFetch calls getAuthToken() again.
          // Since we called cookieStore.set(), checking next/headers behavior:
          // cookies().get() inside the same request DOES NOT reflect set() changes in older Next.js versions,
          // but likely we should pass it explicitly to be safe.
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    }

    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Network Error:", error);
    throw new ApiError("Network error check connectivity", 500);
  }
}

export const api = {
  get: <T>(
    endpoint: string,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions<T>, "method">,
  ) => apiFetch<T>(endpoint, { ...options, method: "GET", schema }),

  post: <T>(
    endpoint: string,
    body: any,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions<T>, "method" | "body">,
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
      schema,
    }),

  put: <T>(
    endpoint: string,
    body: any,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions<T>, "method" | "body">,
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
      schema,
    }),

  patch: <T>(
    endpoint: string,
    body: any,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions<T>, "method" | "body">,
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
    options?: Omit<FetchOptions<T>, "method">,
  ) => apiFetch<T>(endpoint, { ...options, method: "DELETE", schema }),

  postFormData: <T>(
    endpoint: string,
    formData: FormData,
    schema?: ZodSchema<T>,
    options?: Omit<FetchOptions<T>, "method" | "body">,
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      schema,
    }),
};
