import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { getCurrentUser } from "@/actions/auth";
import { userSchema, type User } from "@/lib/unified-types";

export const getSession = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  const result = await getCurrentUser();
  if (result.success) return result.data;

  return null;
});
