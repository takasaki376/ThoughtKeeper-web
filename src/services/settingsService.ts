const fetchSettings = async () => {
  try {
    const token = localStorage.getItem("token"); // トークンを取得
    const response = await fetch("/api/settings", {
      headers: {
        Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("設定の取得に失敗しました");
    }

    const data = await response.json();
    return data; // 取得したデータを返す
  } catch (error) {
    console.error("設定の取得中にエラーが発生しました:", error);
    throw error; // エラーを再スローして呼び出し元で処理できるようにする
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
