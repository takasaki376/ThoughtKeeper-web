"use client";
import { useAtom } from "jotai";
import ky from "ky";
import { useEffect } from "react";

import type { User } from "@/store";
import { userStateAtom } from "@/store";

export function useUser() {
  const [user, setUser] = useAtom(userStateAtom);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await ky.get('/api/auth/user').json<{ user: User | null }>();
        setUser(user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, [setUser]);

  return { user };
}
