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
        <h2 className="py-5">テーマ</h2>
        {currentTheme && (
          <div>
            <p className="text-lg font-bold">{currentTheme.theme}</p>
            <p className="text-right text-sm"> {remainingTime} 秒</p>{" "}
            {/* 残り秒数を表示 */}
          </div>
        )}
      </div>
      <Tiptap />
    </>
  );
}
