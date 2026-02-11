"use client";

import { createContext, useContext } from "react";
import type { User } from "@/lib/schema/auth-schema";

type UserContextType = {
  user: User | null;
};

const UserContext = createContext<UserContextType>({ user: null });

export function UserProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
