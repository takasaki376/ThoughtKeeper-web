"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Tiptap } from "@/component/TipTap";
import { countTime, memoListAtom, themeAtom } from "@/store/setting";

export default function MemoEditorPage() {
  const router = useRouter();
  const themes = useAtomValue(themeAtom);
  const themeTime = useAtomValue(countTime);

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(themes[0] || null);
  const [remainingTime, setRemainingTime] = useState(Number(themeTime));
  const [inputContent, setInputContent] = useState("");
  const setMemoList = useSetAtom(memoListAtom);

  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 1) {
          // メモを保存
          if (currentTheme && inputContent.trim()) {
            const currentDate = new Date().toLocaleDateString();
            const currentTime = new Date().toLocaleTimeString();
            setMemoList((prev) => [
              ...prev,
              {
                content: inputContent,
                date: currentDate,
                theme: currentTheme.theme,
                time: currentTime,
              },
            ]);
            console.log("Memo saved:", inputContent);
          }

          // 次のテーマに切り替え
          const nextIndex = (currentThemeIndex + 1) % themes.length;

          // 全テーマを一巡したらページ遷移
          if (nextIndex === 0) {
            router.push("/MemoList");
          } else {
            setCurrentTheme(themes[nextIndex]);
            setCurrentThemeIndex(nextIndex);
          }

          // 入力フィールドをクリア
          setInputContent("");

          // 残り時間をリセット
          return Number(themeTime);
        }
        return prevTime - 1; // 時間を減少
      });
    }, 1000);

    return () => clearInterval(timerId); // クリーンアップ処理
  }, [
    currentTheme,
    currentThemeIndex,
    inputContent,
    themeTime,
    themes,
    router,
    setMemoList,
  ]);

  useEffect(() => {
    if (themes.length > 0) {
      setCurrentTheme(themes[currentThemeIndex]);
    }
  }, [themes, currentThemeIndex]);

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-5">
        <h2>テーマ</h2>
        <div className="flex flex-row items-baseline justify-center">
          <div className="mb-4 text-sm text-lightGray">
            {themes.map((theme, index) => (
              <p
                key={index}
                className={`${
                  index === currentThemeIndex
                    ? "text-base font-semibold text-yellow-700"
                    : "text-sm"
                }`}
              >
                {theme.title} : {theme.theme}
              </p>
            ))}
          </div>
          <div className="ml-3 text-sm">
            <p>
              残り {currentThemeIndex + 1}/{themes.length} 個
            </p>
            <p className="text-right">{remainingTime} 秒</p>
          </div>
        </div>
      </div>
      <Tiptap value={inputContent} onChange={setInputContent} />
    </>
  );
}
