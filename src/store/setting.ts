import { atom } from "jotai";

export const themeAtom = atom<any[]>([]); // 初期値を空の配列に設定

export const countTheme = atom(10);
export const countTime = atom("60");
export const initialText = atom("");

// 書き込み可能なatomにするため、setter関数を定義
export const setThemeAtom = atom(
  (get) => get(themeAtom), // 読み込み時
  (get, set, newThemes: any[]) => set(themeAtom, newThemes) // 書き込み時
);
