"use server";

import { cookies } from "next/headers";
import { api, ApiError } from "@/lib/api/simple-client";
import { endpoints } from "./endpoints";
import { userSchema, type ActionResult } from "@/lib/unified-types";
import type { User } from "@/lib/unified-types";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ActionResult<{ access: string; refresh: string; user: User }>> {
  try {
    const data = await api.post<{
      access: string;
      refresh: string;
      user: User;
    }>(endpoints.auth.login, { email, password }, undefined, {
      requiresAuth: false,
    });

    const cookieStore = await cookies();
    cookieStore.set("accessToken", data.access, COOKIE_OPTIONS);
    cookieStore.set("refreshToken", data.refresh, COOKIE_OPTIONS);

    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        fieldErrors: error.details as Record<string, string[]> | undefined,
      };
    }
    return { success: false, error: "Login failed" };
  }
}

export async function register({
  fullName,
  email,
  password,
  phoneNumber,
}: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}): Promise<ActionResult<User>> {
  try {
    const data = await api.post<User>(
      endpoints.auth.register,
      { fullName, email, password, rePassword: password, phoneNumber },
      undefined,
      { requiresAuth: false },
    );
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        fieldErrors: error.details as Record<string, string[]> | undefined,
      };
    }
    return { success: false, error: "Registration failed" };
  }
}

export async function verifyEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<ActionResult<{ message: string }>> {
  try {
    const result = await api.post(
      endpoints.auth.verifyEmail,
      { email, code },
      undefined,
      { requiresAuth: false },
    );
    return { success: true, data: result as { message: string } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Verification failed",
    };
  }
}

export async function getCurrentUser(): Promise<ActionResult<User>> {
  try {
    const data = await api.get(endpoints.auth.me, userSchema);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await logout();
    }
    return {
      success: false,
      error: error instanceof ApiError ? error.message : "Failed to fetch user",
    };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export async function setPassword({
  uidb64,
  token,
  password,
  rePassword,
}: {
  uidb64: string;
  token: string;
  password: string;
  rePassword: string;
}): Promise<ActionResult<{ message: string }>> {
  try {
    if (password !== rePassword) {
      return { success: false, error: "Passwords do not match" };
    }
    const result = await api.post(endpoints.auth.setPassword(uidb64, token), {
      password,
      rePassword,
    });
    return { success: true, data: result as { message: string } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ApiError ? error.message : "Failed to set password",
    };
  }
}

export async function googleLogin(
  token: string,
): Promise<ActionResult<{ access: string; refresh: string; user: User }>> {
  try {
    const data = await api.post<{
      access: string;
      refresh: string;
      user: User;
    }>(endpoints.auth.googleLogin, { token }, undefined, {
      requiresAuth: false,
    });

    const cookieStore = await cookies();
    cookieStore.set("accessToken", data.access, COOKIE_OPTIONS);
    cookieStore.set("refreshToken", data.refresh, COOKIE_OPTIONS);

    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        fieldErrors: error.details as Record<string, string[]> | undefined,
      };
    }
    return { success: false, error: "Google login failed" };
  }
}
