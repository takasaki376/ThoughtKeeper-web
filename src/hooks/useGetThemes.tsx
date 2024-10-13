"use client";
import { useEffect, useState } from "react";

import { getThemes } from "@/pages/api/themes";
import { themes } from "@/types/database";

export function useGetThemes() {
  const [themes, setThemes] = useState<themes>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const result = (await getThemes()) as themes;
        setThemes(result);
      } catch (err) {
        setError("Failed to fetch themes");
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return { error, loading, themes };
}
