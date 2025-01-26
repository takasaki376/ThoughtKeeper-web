"use client";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { setThemeAtom } from "@/store/setting";
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
        const response = await fetch("/api/themes");
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Network response was not ok: ${errorMessage}`);
        }
        const result = (await response.json()) as Themes;
        setAllThemes(result);
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
