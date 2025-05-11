import { atom } from "jotai";

import type { Themes } from "@/types/database";

export const themeAtom = atom<Themes>([]); // 初期値を空の配列に設定
export const setThemeAtom = atom(
  (get) => get(themeAtom), // 読み込み時
  (get, set, newThemes: Themes) => set(themeAtom, newThemes) // 書き込み時
);
