"use client";
import { useAtom } from "jotai";
import ky from "ky";
import { useEffect, useState } from "react";

import type { User } from "@/store";
import { userStateAtom } from "@/store";

export function useUser() {
  const [user, setUser] = useAtom(userStateAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await ky
          .get("/api/auth/user")
          .json<{ user: User | null }>();
        setUser(user);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        setError(error instanceof Error ? error : new Error(String(error)));
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  return { user, isLoading, error };
}
