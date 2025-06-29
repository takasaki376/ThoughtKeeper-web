import { atom } from "jotai";

import { fetchSettings, updateSettings } from "@/services/settingsService";

// テーマ数の設定を管理するatom（初期値: 10）
// ユーザーが設定画面で指定する、ランダム選択するテーマの数
export const countTheme = atom(10);

// 時間制限の設定を管理するatom（初期値: "60"）
// ユーザーが設定画面で指定する、メモ作成の時間制限（分）
export const countTime = atom("60");

// 設定データを取得してatomに反映するための書き込み可能なatom
// 読み取りは行わず、書き込みのみを行う
export const getSetting = atom(
  null,
  async (_get, set) => {
    // APIから設定データを取得
    const setting = await fetchSettings();

    // 取得したデータを各atomに設定
    set(countTheme, setting.theme_count);  // テーマ数を設定
    set(countTime, setting.time_limit);    // 時間制限を設定
  }
);

// テーマ数を更新するための書き込み可能なatom
// 新しいテーマ数を受け取り、atomを更新し、APIにも反映
export const setCountThemeAtom = atom(
  null,
  (get, set, newCount: number) => {
    // ローカルのatomを更新
    set(countTheme, newCount);

    // APIに設定を更新（非同期処理なのでエラーハンドリング）
    updateSettings(newCount, get(countTime)).catch(console.error);
  }
);

// 時間制限を更新するための書き込み可能なatom
// 新しい時間制限を受け取り、atomを更新し、APIにも反映
export const setCountTimeAtom = atom(
  null,
  (get, set, newTime: string) => {
    // ローカルのatomを更新
    set(countTime, newTime);

    // APIに設定を更新（非同期処理なのでエラーハンドリング）
    updateSettings(get(countTheme), newTime).catch(console.error);
  }
);
