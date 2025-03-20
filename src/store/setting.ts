import { atom } from "jotai";

import { fetchSettings, updateSettings } from "@/services/settingsService";

// countTheme と countTime の atom を正しく定義
export const countTheme = atom(10); // ここは初期値を設定
export const countTime = atom("60"); // 初期値を設定



export const getSetting = atom(
  null,
  async (_get, set) => {
    const setting = await fetchSettings();
    set(countTheme, setting.theme_count);
    set(countTime, setting.time_limit);
  }
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
