import ky from "ky";
import useSWR from "swr";

import type { Setting } from "@/types/database";

const fetcher = (url: string) => ky.get(url).json<Setting>();

export const useSettings = () => {
  const { data, error, isLoading, mutate } = useSWR<Setting>(
    "/api/settings",
    fetcher
  );

  const updateSettings = async (newSettings: Partial<Setting>) => {
    // Optimistic UI update
    mutate({ ...data, ...newSettings } as Setting, false);

    try {
      const updated = await ky
        .put("/api/settings", { json: newSettings })
        .json<Setting>();
      // Revalidate with updated data
      mutate(updated);
    } catch (e) {
      // Revert on error
      mutate();
      console.error("Setting update failed:", e);
      throw e;
    }
  };

  return {
    error,
    isLoading,
    settings: data,
    updateSettings,
  };
};
