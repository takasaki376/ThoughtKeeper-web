import { atom } from "jotai";

export const themeAtom = atom<any[]>([]); // 初期値を空の配列に設定

// countTheme と countTime の atom を正しく定義
export const countTheme = atom(10); // ここは初期値を設定
export const countTime = atom("60"); // 初期値を設定

// 書き込み可能な atom にするための設定
export const setThemeAtom = atom(
  (get) => get(themeAtom), // 読み込み時
  (get, set, newThemes: any[]) => set(themeAtom, newThemes) // 書き込み時
);

// 書き込み可能な atom を追加
export const setCountThemeAtom = atom(
  null, // 読み込み時の値は不要
  (get, set, newCount: number) => set(countTheme, newCount) // 新しいテーマ数を設定
);

export const setCountTimeAtom = atom(
  null, // 読み込み時の値は不要
  (get, set, newTime: string) => set(countTime, newTime) // 新しい時間を設定
);

export const initialText = atom("");
