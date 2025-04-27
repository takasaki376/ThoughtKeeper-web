"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { getUser } from "@/app/actions/auth";
import { userStateAtom } from "@/store";

export function useUser() {
  const [user, setUser] = useAtom(userStateAtom);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await getUser();
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
