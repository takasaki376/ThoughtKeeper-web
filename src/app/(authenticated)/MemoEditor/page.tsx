/* eslint-disable no-unused-vars */
"use client";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Tiptap } from "@/component/TipTap";
import { countTime, themeAtom } from "@/store/setting";

export default function MemoEditorPage() {
  const themes = useAtomValue(themeAtom); // テーマのリストを取得
  const themeTime = useAtomValue(countTime); // 設定されたカウントダウン時間を取得

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0); // 現在表示するテーマのインデックス
  const [currentTheme, setCurrentTheme] = useState(themes[0]); // 現在表示されているテーマ
  const [remainingTime, setRemainingTime] = useState(Number(themeTime)); // 残り時間を設定された値に設定

  useEffect(() => {
    // 1秒ごとに残り時間をカウントダウン
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 1) {
          // 残り時間が0になったら次のテーマに切り替える
          setCurrentThemeIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % themes.length; // インデックスを循環させる
            setCurrentTheme(themes[nextIndex]); // 次のテーマをセット
            return nextIndex;
          });
          return Number(themeTime); // 残り時間を設定された時間にリセット
        }
        return prevTime - 1; // 残り時間を1秒減らす
      });
    }, 1000); // 1秒ごとにカウントダウン

    return () => clearInterval(timerId); // クリーンアップでインターバルをクリア
  }, [themes, themeTime]);

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
          <div className="">
            <p className="text-sm">
              残り {currentThemeIndex + 1}/{themes.length} 個
            </p>
            <p className="text-right text-sm"> {remainingTime} 秒</p>
          </div>
        </div>
      </div>
      <Tiptap />
    </>
  );
}
