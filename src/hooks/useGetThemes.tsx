"use client";
import { useEffect, useState } from "react";

import type { Themes } from "@/types/database";

export function useGetThemes() {
  const [themes, setThemes] = useState<Themes>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

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
        setThemes(result);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch themes");
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return { error, loading, themes };
}
