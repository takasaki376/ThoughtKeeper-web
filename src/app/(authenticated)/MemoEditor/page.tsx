"use client";
import { useAtomValue, useSetAtom } from "jotai";
import ky from "ky";
import { useCallback, useEffect, useRef, useState } from "react";

import { Tiptap } from "@/component/TipTap";
import { useThemeTimer } from "@/hooks/useThemeTimer";
import { countTime, memoListAtom, recentMemosAtom, themeAtom } from "@/store";
import type { Memo, Theme } from "@/types/database";

const MemoEditorPage = () => {
  const themes = useAtomValue(themeAtom);
  const themeTime = useAtomValue(countTime);
  const setRecentMemos = useSetAtom(recentMemosAtom);

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(themes[0] || null);
  const [inputContent, setInputContent] = useState("");
  const setMemoList = useSetAtom(memoListAtom);

  // 入力内容を保存するための参照を使用
  const inputContentRef = useRef(inputContent);
  inputContentRef.current = inputContent;

  const handleThemeChange = useCallback(
    (nextIndex: number) => {
      setInputContent("");
      setCurrentTheme(themes[nextIndex]);
      setCurrentThemeIndex(nextIndex);
    },
    [themes]
  );

  const saveMemo = useCallback(async () => {
    if (currentTheme && inputContentRef.current) {
      try {
        const responseData = await ky
          .put("/api/memos", {
            json: {
              content: inputContentRef.current,
              theme_id: currentTheme.id,
            },
          })
          .json<Memo>();

        // 状態を更新
        setMemoList((prev) => {
          const isAlreadySaved = prev.some(
            (memo) =>
              memo.theme.id === currentTheme.id &&
              memo.content === inputContentRef.current
          );

          if (!isAlreadySaved) {
            const newMemo = {
              id: responseData.id,
              content: inputContentRef.current,
              created_at: responseData.created_at,
              local_created_at: new Date().toISOString(),
              theme: currentTheme,
            };
            console.log("Memo saved to DB:", inputContentRef.current);
            setRecentMemos((prev) => [...prev, newMemo]);
            return [...prev, newMemo];
          }
          return prev;
        });
      } catch (error) {
        console.error("メモの保存に失敗しました:", error);
        throw error;
      }
    }
  }, [currentTheme, setMemoList, setRecentMemos]);

  const { remainingTime, startTimer } = useThemeTimer(
    Number(themeTime),
    themes.length,
    currentThemeIndex,
    saveMemo,
    handleThemeChange
  );

  useEffect(() => {
    const cleanup = startTimer();
    return cleanup;
  }, [startTimer]);

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-5">
        <h2>テーマ</h2>
        <div className="flex flex-row items-baseline justify-center">
          <div className="mb-4 text-sm text-lightGray">
            {themes.map((theme: Theme, index: number) => (
              <p
                key={theme.theme}
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
};

export default MemoEditorPage;
