import { createGet, createPut } from "@/services/api";
import type { Memo } from "@/types/database";

export const fetchMemos = async () => {
  const { data } = await createGet<Memo>('memo');
  return data;
};



// 設定更新用の関数を追加
export const updateMemos = async (content: string, theme_id: string) => {
  const { data } = await createPut<Memo>('memo', {
    content,
    theme_id,
  });
  return data;
};
