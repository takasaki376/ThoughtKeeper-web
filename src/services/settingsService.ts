export const fetchSettings = async () => {
  const response = await fetch("/api/settings");
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return response.json();
};

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
