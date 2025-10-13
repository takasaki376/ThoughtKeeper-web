import { createGet, createPut } from "@/services/api";
import type { Memo } from "@/types/database";

/**
 * すべてのメモを取得します。
 * @returns {Promise<Memo[]>} メモの配列
 */
export const fetchMemos = async () => {
  // 関数名から複数のメモを取得すると推測されるため、型を Memo[] に修正
  const { data } = await createGet<Memo[]>("memo");
  return data;
};

/**
 * メモの内容を更新します。
 * @returns {Promise<Memo>} 更新されたメモ
 */
export const updateMemos = async (content: string, theme_id: string) => {
  const { data } = await createPut<Memo>("memo", { content, theme_id });
  return data;
};
