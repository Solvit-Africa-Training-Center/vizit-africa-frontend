import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/actions/auth";
import type { User } from "@/lib/schema/auth-schema";

export const getSession = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  const result = await getCurrentUser();
  if (result.success) return result.data;

  return null;
});
