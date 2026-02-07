import { unstable_cache } from "next/cache";
import { sampleRequests, users } from "@/lib/dummy-data";
import type { Request, User } from "@/lib/schemas";

const SIMULATED_DELAY = 1000;

export const getRequests = unstable_cache(
  async (): Promise<Request[]> => {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));
    return sampleRequests;
  },
  ["requests"],
  {
    revalidate: 60,
    tags: ["requests"],
  },
);

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
