import { createGet, createPut } from "@/services/api";
import type { UserSettings } from "@/types/database";

export const fetchSettings = async () => {
  const { data } = await createGet<UserSettings>('settings');
  return data;
};

// 設定更新用の関数を追加
export const updateSettings = async (theme_count: number, time_limit: string) => {
  const { data } = await createPut<UserSettings>('settings', {
    theme_count,
    time_limit,
  });
  return data;
};
