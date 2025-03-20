import { atom } from "jotai";

import { createGet, createPut } from "@/services/api";
import type { UserSettings } from "@/types/database";

// countTheme と countTime の atom を正しく定義
export const countTheme = atom<number>(10); // ここは初期値を設定
export const countTime = atom<string>("60"); // 初期値を設定

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

export const fetchSettings = async () => {
  const { data } = await createGet<UserSettings>('settings');
  return data;
};

export const updateSettings = async (theme_count: number, time_limit: string) => {
  const { data } = await createPut<UserSettings>('settings', {
    theme_count,
    time_limit,
  });
  return data;
};
