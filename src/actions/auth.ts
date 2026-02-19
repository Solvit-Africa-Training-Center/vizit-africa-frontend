"use server";

import { cookies } from "next/headers";
import { type ActionResult, ApiError } from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { endpoints } from "./endpoints";
import {
  type LoginInput,
  type LoginResponse,
  type RegisterInput,
  type RegisterResponse,
  type VerifyEmailInput,
  type VerifyEmailResponse,
  type User,
  type SetPasswordInput,
  type SetPasswordResponse,
  loginInputSchema,
  loginResponseSchema,
  registerInputSchema,
  registerResponseSchema,
  verifyEmailInputSchema,
  verifyEmailResponseSchema,
  setPasswordInputSchema,
  setPasswordResponseSchema,
  userSchema,
} from "@/lib/schema/auth-schema";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export async function login(
  input: LoginInput,
): Promise<ActionResult<LoginResponse>> {
  const validation = loginInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.auth.login,
      validation.data,
      loginResponseSchema,
      {
        requiresAuth: false,
      },
    );

    const cookieStore = await cookies();
    cookieStore.set("accessToken", data.access, COOKIE_OPTIONS);
    cookieStore.set("refreshToken", data.refresh, COOKIE_OPTIONS);

    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message,
      fieldErrors: err.fieldErrors,
    };
  }
}

export async function register(
  input: RegisterInput,
): Promise<ActionResult<RegisterResponse>> {
  const validation = registerInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.auth.register,
      validation.data,
      registerResponseSchema,
      {
        requiresAuth: false,
      },
    );

    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message,
      fieldErrors: err.fieldErrors,
    };
  }
}

export async function verifyEmail(
  input: VerifyEmailInput,
): Promise<ActionResult<VerifyEmailResponse>> {
  const validation = verifyEmailInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.auth.verifyEmail,
      validation.data,
      verifyEmailResponseSchema,
      { requiresAuth: false },
    );
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message,
      fieldErrors: err.fieldErrors,
    };
  }
}

export async function getCurrentUser(): Promise<ActionResult<User>> {
  try {
    const data = await api.get(endpoints.auth.me, userSchema);
    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    if (err.status === 401) {
      try {
        await logout();
      } catch { }
    }
    return {
      success: false,
      error: err.message,
    };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export async function setPassword(
  input: SetPasswordInput,
): Promise<ActionResult<SetPasswordResponse>> {
  const validation = setPasswordInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await api.post(
      endpoints.auth.setPassword,
      validation.data,
      setPasswordResponseSchema,
      { requiresAuth: false },
    );

    const cookieStore = await cookies();
    cookieStore.set("accessToken", data.access, COOKIE_OPTIONS);
    cookieStore.set("refreshToken", data.refresh, COOKIE_OPTIONS);

    return { success: true, data };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.message,
      fieldErrors: err.fieldErrors,
    };
  }
}
