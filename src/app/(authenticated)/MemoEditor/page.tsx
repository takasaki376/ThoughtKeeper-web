/* eslint-disable no-unused-vars */
"use client";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Tiptap } from "@/component/TipTap";
import { themeAtom } from "@/store/setting";

export default function MemoEditorPage() {
  const themes = useAtomValue(themeAtom); // themeAtomの値を取得
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0); // 現在表示するテーマのインデックス
  const [currentTheme, setCurrentTheme] = useState(themes[0]); // 現在表示されているテーマ

  useEffect(() => {
    // 60秒ごとにテーマを切り替える
    const intervalId = setInterval(() => {
      setCurrentThemeIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % themes.length; // インデックスを循環させる
        setCurrentTheme(themes[nextIndex]); // 次のテーマをセット
        return nextIndex;
      });
    }, 60000); // 60000ms = 60秒

    return () => clearInterval(intervalId); // クリーンアップでインターバルをクリア
  }, [themes]);

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-5">
        <h2 className="py-5">テーマ</h2>
        {currentTheme && (
          <div>
            <p className="text-lg font-bold">{currentTheme.theme}</p>
          </div>
        )}
      </div>
      <Tiptap />
    </>
  );
}
