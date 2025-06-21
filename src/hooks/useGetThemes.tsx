"use client";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { createGet } from "@/services/api";
import { setThemeAtom } from "@/store";
import type { Themes } from "@/types/database";

export function useGetThemes() {
  // 全テーマを格納する状態
  const [allThemes, setAllThemes] = useState<Themes>([]);

  // ローディング状態を管理
  const [loading, setLoading] = useState(true);

  // エラー状態を管理
  const [error, setError] = useState<null | string>(null);

  // グローバルストアのテーマを更新するための関数を取得
  const setThemes = useSetAtom(setThemeAtom);

  // コンポーネントマウント時にテーマデータを取得
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        // APIからテーマデータを取得
        const { data } = await createGet<Themes>("themes");
        setAllThemes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch themes");
      } finally {
        // 取得完了後、ローディング状態をfalseに設定
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  // 指定された数だけテーマをランダムに選択する関数
  const randomSelect = (theme: Themes, num: number): Themes => {
    const newTheme: Themes = [];

    // 指定された数分だけ、または元のテーマがなくなるまで繰り返し
    while (newTheme.length < num && theme.length > 0) {
      // ランダムなインデックスを生成
      const rand = Math.floor(Math.random() * theme.length);

      // ランダムに選択されたテーマを新しい配列に追加
      newTheme.push(theme[rand]);

      // 選択されたテーマを元の配列から削除（重複を避けるため）
      theme.splice(rand, 1);
    }

    // 選択されたテーマをグローバルストアに保存
    setThemes(newTheme);

    // 選択されたテーマの配列を返す
    return newTheme;
  };

  // フックの戻り値：全テーマ、エラー状態、ローディング状態、ランダム選択関数
  return { allThemes, error, loading, randomSelect };
}
