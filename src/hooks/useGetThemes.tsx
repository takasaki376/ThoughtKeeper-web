"use client";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { createGet } from "@/services/api";
import { setThemeAtom } from "@/store/themes";
import type { Themes } from "@/types/database";

export function useGetThemes() {
  const [allThemes, setAllThemes] = useState<Themes>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const setThemes = useSetAtom(setThemeAtom);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const { data } = await createGet<Themes>("themes");
        setAllThemes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch themes");
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const randomSelect = (theme: Themes, num: number): Themes => {
    const newTheme: Themes = [];
    while (newTheme.length < num && theme.length > 0) {
      const rand = Math.floor(Math.random() * theme.length);
      newTheme.push(theme[rand]);
      theme.splice(rand, 1);
    }
    setThemes(newTheme);
    return newTheme;
  };

  return { allThemes, error, loading, randomSelect };
}
