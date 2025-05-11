"use client";
import { useAtomValue, useSetAtom } from "jotai";
import ky from "ky";
import { useCallback, useEffect, useRef, useState } from "react";

import { Drawing } from "@/component/Drawing";
import { Tiptap } from "@/component/TipTap";
import { useThemeTimer } from "@/hooks/useThemeTimer";
import { countTime, memoListAtom, recentMemosAtom, themeAtom } from "@/store";
import type { Memo, Theme } from "@/types/database";

const MemoEditorPage = () => {
  const themes = useAtomValue(themeAtom);
  const themeTime = useAtomValue(countTime);
  const setRecentMemos = useSetAtom(recentMemosAtom);
  const editorRef = useRef<HTMLDivElement>(null);

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(themes[0] || null);
  const [textContent, setTextContent] = useState("");
  const [drawingContent, setDrawingContent] = useState("");
  const setMemoList = useSetAtom(memoListAtom);

  // 入力内容を保存するための参照を使用
  const textContentRef = useRef(textContent);
  const drawingContentRef = useRef(drawingContent);
  textContentRef.current = textContent;
  drawingContentRef.current = drawingContent;

  // エディタに自動フォーカスを当てる
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current) {
        const editorElement = editorRef.current.querySelector(".ProseMirror");
        if (editorElement instanceof HTMLElement) {
          editorElement.focus();
        }
      }
    }, 100); // エディタのマウントを待つ

    return () => clearTimeout(timer);
  }, [currentThemeIndex, themes]); // テーマが変更されるたびにフォーカスを当てる

  const handleThemeChange = useCallback(
    (nextIndex: number) => {
      setTextContent("");
      setDrawingContent("");
      setCurrentTheme(themes[nextIndex]);
      setCurrentThemeIndex(nextIndex);
    },
    [themes]
  );

  const saveMemo = useCallback(async () => {
    if (currentTheme && (textContentRef.current || drawingContentRef.current)) {
      try {
        const responseData = await ky
          .put("/api/memos", {
            json: {
              content: textContentRef.current,
              drawing: drawingContentRef.current,
              theme_id: currentTheme.id,
            },
          })
          .json<Memo>();

        // 状態を更新
        setMemoList((prev) => {
          const isAlreadySaved = prev.some(
            (memo) =>
              memo.theme.id === currentTheme.id &&
              memo.content === textContentRef.current &&
              memo.drawing === drawingContentRef.current
          );

          if (!isAlreadySaved) {
            const newMemo = {
              id: responseData.id,
              content: textContentRef.current,
              created_at: responseData.created_at,
              drawing: drawingContentRef.current,
              local_created_at: responseData.created_at,
              theme: currentTheme,
            };
            console.log("Memo saved to DB:", textContentRef.current);
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
      <div className="flex flex-col">
        <div ref={editorRef}>
          <p className="text-center">文字入力フィールド</p>
          <Tiptap value={textContent} onChange={setTextContent} />
        </div>
        <div className="mt-10">
          <p className="text-center">手書きフィールド</p>
          <Drawing value={drawingContent} onChange={setDrawingContent} />
        </div>
      </div>
    </>
  );
};

export default MemoEditorPage;
