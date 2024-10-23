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
          // 残り時間が0になったら次のテーマに切り替え
          const nextIndex = (currentThemeIndex + 1) % themes.length;
          const nextTheme = themes[nextIndex];

          // メモを保存
          if (currentTheme && inputContent) {
            const currentDate = new Date().toLocaleDateString();
            const currentTime = new Date().toLocaleTimeString();

            // メモの重複を確認
            setMemoList((prev) => {
              const isAlreadySaved = prev.some(
                (memo) =>
                  memo.theme === currentTheme.theme &&
                  memo.content === inputContent
              );

              if (!isAlreadySaved) {
                console.log("Memo saved:", inputContent); // メモ保存時にログを出力
                return [
                  ...prev,
                  {
                    content: inputContent,
                    date: currentDate,
                    theme: currentTheme.theme,
                    time: currentTime,
                  },
                ];
              }
              return prev; // 重複している場合はそのまま返す
            });
          }

          // 次のテーマに切り替える
          setCurrentTheme(nextTheme);
          setCurrentThemeIndex(nextIndex);

          // 入力フィールドをクリア
          setInputContent("");

          // 全テーマを一巡したらページ遷移
          if (nextIndex === 0) {
            router.push("/MemoList");
          }

          return Number(themeTime); // 残り時間をリセット
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [
    currentTheme,
    currentThemeIndex,
    themeTime,
    themes,
    router,
    setMemoList,
    inputContent,
  ]);

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
