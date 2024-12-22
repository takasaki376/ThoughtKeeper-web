import { atom } from "jotai";

import { updateSettings } from "@/services/settingsService";

export const themeAtom = atom<any[]>([]); // 初期値を空の配列に設定
export const memoListAtom = atom<{ content: string; date: string; theme: string; time: string }[]>([]);

// countTheme と countTime の atom を正しく定義
export const countTheme = atom(10); // ここは初期値を設定
export const countTime = atom("60"); // 初期値を設定

// 書き込み可能な atom にするための設定
export const setThemeAtom = atom(
  (get) => get(themeAtom), // 読み込み時
  (get, set, newThemes: any[]) => set(themeAtom, newThemes) // 書き込み時
);


// 既存のatomの設定用関数
export const setCountThemeAtom = atom(
  null,
  (get, set, newCount: number) => {
    set(countTheme, newCount);
    // 設定を更新
    updateSettings(newCount, get(countTime)).catch(console.error);
  }
);

export const setCountTimeAtom = atom(
  null,
  (get, set, newTime: string) => {
    set(countTime, newTime);
    // 設定を更新
    updateSettings(get(countTheme), newTime).catch(console.error);
  }
);

export const initialText = atom("");
