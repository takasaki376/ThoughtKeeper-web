import { atom } from "jotai";

import { createGet, createPut } from "@/services/api";
import type { Memo } from "@/types/database";

export const memoListAtom = atom<Memo[]>([]);
export const setMemoListAtom = atom(
  (get) => get(memoListAtom),
  (get, set, newMemos: Memo[]) => set(memoListAtom, newMemos)
);

export const fetchMemos = async () => {
  const { data } = await createGet<Memo[]>('memos');
  return data;
};

export const updateMemo = async (content: string, theme_id: string) => {
  const { data } = await createPut<Memo>('memos', {
    content,
    theme_id,
  });
  return data;
};
