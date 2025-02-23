
import { Setting } from "@/types/database";

import api from "./api";

const fetchSettings = async () => {
  try {
    const data = await api.get<Setting>('settings').json();
    return data;
  } catch (error) {
    console.error("設定の取得中にエラーが発生しました:", error);
    throw error;
  }
};

export { fetchSettings };

// 設定更新用の関数を追加
export const updateSettings = async (theme_count: number, time_limit: string) => {
  try {
    const response = await fetch("/api/settings", {
      body: JSON.stringify({
        theme_count,
        time_limit,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("設定の更新に失敗しました");
    }

    return await response.json();
  } catch (error) {
    console.error("設定更新エラー:", error);
    throw error;
  }
};
