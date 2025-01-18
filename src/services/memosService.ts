export const fetchMemos = async () => {
  const response = await fetch("/api/memos");
  if (!response.ok) {
    throw new Error("Failed to fetch Memos");
  }
  return response.json();
};

// 設定更新用の関数を追加
export const updateMemos = async (content: string, theme_id: string) => {
  try {
    const response = await fetch("/api/memos", {
      body: JSON.stringify({
        content,
        theme_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("メモの更新に失敗しました");
    }

    const responseText = await response.text();
    if (!responseText) {
      throw new Error("空のレスポンスが返されました");
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("メモ更新エラー:", error);
    throw error;
  }
};
