import { createGet, createPut } from "@/services/api";
import type { Setting } from "@/types/database";

/**
 * 設定情報を取得します。
 * @returns {Promise<Setting>} 設定情報
 */
export const fetchSettings = async () => {
  const { data } = await createGet<Setting>("settings");
  return data;
};

/**
 * 設定情報を更新します。
 * @returns {Promise<Setting>} 更新された設定情報
 */
export const updateSettings = async (
  theme_count: number,
  time_limit: string,
  last_selected_input_type?: string
) => {
  const payload = {
    last_selected_input_type,
    theme_count,
    time_limit,
  };
  const { data } = await createPut<Setting>("settings", payload);
  return data;
};
