import { cookies } from "next/headers";
import { type ZodSchema, z } from "zod";
import { ApiError } from "./types";

type FetchOptions<T = any> = RequestInit & {
  schema?: ZodSchema<T>;
  requiresAuth?: boolean;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://linguistic-murial-adventist-university-of-central-afri-7975ce32.koyeb.app/api";

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

async function handleResponse<T>(
  response: Response,
  schema?: ZodSchema<T>,
): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    let fieldErrors = undefined;

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
      if (
        typeof errorData === "object" &&
        !errorData.detail &&
        !errorData.message
      ) {
        fieldErrors = errorData;
        errorMessage = "Validation error";
      }
    } catch {}

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

    return handleResponse<T>(response, schema);
  } catch (error) {
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
