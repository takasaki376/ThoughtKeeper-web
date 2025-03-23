import { createGet, createPut } from "@/services/api";
import type { Setting } from "@/types/database";

export const fetchSettings = async () => {
  const { data } = await createGet<Setting>('settings');
  return data;
};

// 設定更新用の関数を追加
export const updateSettings = async (theme_count: number, time_limit: string) => {
  const { data } = await createPut<Setting>('settings', {
    theme_count,
    time_limit,
  });
  return data;
};
