"use client";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Loader } from "@/component/Loader";
import { useGetThemes } from "@/hooks/useGetThemes";
import { countTheme, getSetting } from "@/store/setting";

export default function ThemeSelectPage() {
  // 設定値取得の状態管理
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // グローバルストアから設定されたテーマ数を取得（ユーザーが設定画面で指定した数）
  const ThemesToScribble = useAtomValue(countTheme);

  // 設定値を取得するためのatom
  const [, fetchSettings] = useAtom(getSetting);

  // テーマ取得のカスタムフックを使用
  // allThemes: 全テーマの配列
  // error: エラー状態
  // loading: ローディング状態
  // randomSelect: ランダムにテーマを選択する関数
  const { allThemes, error, loading, randomSelect } = useGetThemes();

  // Next.jsのルーターを使用してページ遷移を制御
  const router = useRouter();

  // ページ表示時に設定値を取得
  useEffect(() => {
    const loadSettings = async () => {
      try {
        await fetchSettings();
        setSettingsLoaded(true);
      } catch (err) {
        console.error("Failed to load settings:", err);
        // エラーが発生しても設定値が取得できなくても、初期値で続行
        setSettingsLoaded(true);
      }
    };

    loadSettings();
  }, [fetchSettings]);

  // 設定値の読み込み中またはテーマの読み込み中はローダーを表示
  if (!settingsLoaded || loading) {
    return <Loader />;
  }

  // エラーが発生した場合はエラーメッセージを表示
  if (error) {
    return <div>{error}</div>;
  }

  // 設定されたテーマ数分だけ、全テーマからランダムに選択
  const selected = randomSelect(allThemes, ThemesToScribble);

  // スタートボタンがクリックされた時の処理
  // MemoEditorページに遷移してメモ作成を開始
  const handleStart = () => {
    router.push("/MemoEditor");
  };

  return (
    <div className="">
      {/* ヘッダー部分：今日のテーマとテーマ数を表示 */}
      <div className="my-3 flex justify-around">
        <p>今日のテーマ</p>
        <p>テーマ数：{ThemesToScribble}</p>
      </div>

      {/* 選択されたテーマのリストを表示 */}
      <ul className="p-3">
        {selected.map((item) => {
          return (
            <li key={item.id} className="grid grid-cols-3 gap-3">
              {/* テーマのタイトルを右寄せで表示 */}
              <p className="text-right">【{item.title}】</p>
              {/* テーマの内容を2列分の幅で表示 */}
              <p className="col-span-2">{item.theme}</p>
            </li>
          );
        })}
      </ul>

      {/* スタートボタン：クリックするとメモエディターに遷移 */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="rounded border bg-yellow-700 px-4 py-2 font-bold text-white shadow hover:bg-yellow-500"
          onClick={handleStart}
        >
          スタート
        </button>
      </div>
    </div>
  );
}
