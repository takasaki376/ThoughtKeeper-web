import ky from "ky";
import useSWR from "swr";

import type { Memo } from "@/types/database";

const fetcher = (url: string) => ky.get(url).json<Memo[]>();

export const useMemos = () => {
  const { data: memos, error, isLoading, mutate } = useSWR<Memo[]>(
    "/api/memos",
    fetcher
  );

  const updateMemo = async (memoData: {
    content: string;
    theme_id: string;
    title?: string;
  }) => {
    try {
      // APIを呼び出してメモを更新/作成
      const updatedMemo = await ky.put("/api/memos", { json: memoData }).json<Memo>();

      // キャッシュを更新
      mutate((currentMemos = []) => {
        const memoIndex = currentMemos.findIndex(
          (m) => m.theme.id === updatedMemo.theme.id
        );
        if (memoIndex !== -1) {
          // 既存のメモを置き換え
          const newMemos = [...currentMemos];
          newMemos[memoIndex] = updatedMemo;
          return newMemos;
        }
        // 新しいメモを追加
        return [...currentMemos, updatedMemo];
      }, false); // revalidateをfalseに設定して、即時再検証を防ぐ

      return updatedMemo;
    } catch (e) {
      console.error("Memo update failed:", e);
      // エラー時にはキャッシュを元に戻すことも可能
      // mutate();
      throw e;
    }
  };

  return {
    memos,
    isLoading,
    error,
    updateMemo,
  };
};
