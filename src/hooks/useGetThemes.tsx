"use client";
import { useEffect, useState } from "react";

import { themes } from "@/types/database";

export function useGetThemes() {
  const [themes, setThemes] = useState<themes>([]);
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
        const result = (await response.json()) as themes;
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
