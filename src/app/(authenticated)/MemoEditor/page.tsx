/* eslint-disable no-unused-vars */
"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Tiptap } from "@/component/TipTap";
import { countTime, memoListAtom, themeAtom } from "@/store/setting";

export default function MemoEditorPage() {
  const router = useRouter(); // useRouterを初期化
  const themes = useAtomValue(themeAtom); // テーマのリストを取得
  const themeTime = useAtomValue(countTime); // 設定されたカウントダウン時間を取得

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0); // 現在表示するテーマのインデックス
  const [currentTheme, setCurrentTheme] = useState(themes[0] || null); // 初期値として最初のテーマを設定、テーマがない場合はnull
  const [remainingTime, setRemainingTime] = useState(Number(themeTime)); // 残り時間を設定された値に設定
  const [inputContent, setInputContent] = useState(""); // ユーザーの入力内容を保持
  const setMemoList = useSetAtom(memoListAtom); // メモリストを更新するためのJotai関数

  // タイマー処理
  useEffect(() => {
    // 1秒ごとに残り時間をカウントダウン
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 1) {
          // 残り時間が0になったら次のテーマに切り替える
          setCurrentThemeIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % themes.length;
            const nextTheme = themes[nextIndex];
            setCurrentTheme(nextTheme);

            // 現在のテーマが有効な場合のみメモを保存
            if (currentTheme) {
              const currentDate = new Date().toLocaleDateString(); // 現在の日付
              const currentTime = new Date().toLocaleTimeString(); // 現在の日付
              setMemoList((prev) => [
                ...prev,
                {
                  content: inputContent,
                  date: currentDate,
                  theme: currentTheme.theme, // 現在のテーマを保存
                  time: currentTime,
                },
              ]);
            }

            // 入力フィールドをクリア
            setInputContent("");

            // 全テーマを一巡したらページ遷移
            if (nextIndex === 0) {
              router.push("/MemoList"); // ページ遷移
            }
            return nextIndex;
          });
          return Number(themeTime); // 残り時間を設定された時間にリセット
        }
        return prevTime - 1; // 残り時間を1秒減らす
      });
    }, 1000); // 1秒ごとにカウントダウン

    return () => clearInterval(timerId); // クリーンアップでインターバルをクリア
  }, [themes, themeTime, setMemoList, currentTheme, inputContent, router]);

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-5">
        <h2>テーマ</h2>
        <div className="flex flex-row items-baseline justify-center">
          {/* 全テーマを小さい文字で表示 */}
          <div className="mb-4 text-sm text-lightGray">
            {themes.map((theme, index) => (
              <p
                key={index}
                className={`${
                  index === currentThemeIndex
                    ? "text-base font-semibold text-yellow-700"
                    : "text-sm"
                }`} // 現在のテーマは大きく、色を変更
              >
                {theme.theme}
              </p>
            ))}
          </div>
          <div className="ml-3 text-sm">
            <p>
              残り {currentThemeIndex + 1}/{themes.length} 個
            </p>
            <p className="text-right"> {remainingTime} 秒</p>
          </div>
        </div>
      </div>
      <Tiptap value={inputContent} onChange={setInputContent} />
      {/* Tiptapの内容を保持 */}
    </>
  );
}
