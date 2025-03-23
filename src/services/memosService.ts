import { createGet, createPut } from "@/services/api";
import type { Memo } from "@/types/database";

export const fetchMemo = async () => {
  const { data } = await createGet<Memo>('memo');
  return data;
};

export const updateMemo = async (content: string, theme_id: string) => {
  const { data } = await createPut<Memo>('memo', {
    content,
    theme_id,
  });
  return data;
};
