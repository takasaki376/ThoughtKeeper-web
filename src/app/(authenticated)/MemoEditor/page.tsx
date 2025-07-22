"use client";
import { useAtomValue, useSetAtom } from "jotai";
import ky from "ky";
import { useCallback, useEffect, useRef, useState } from "react";

import { Drawing } from "@/component/Drawing";
import { Tab } from "@/component/Tab";
import { Tiptap } from "@/component/TipTap";
import { useThemeTimer } from "@/hooks/useThemeTimer";
import { fetchSettings, updateSettings } from "@/services/settingsService";
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
  const [activeTab, setActiveTab] = useState("text");
  const [hasDrawingInput, setHasDrawingInput] = useState(false);
  const setMemoList = useSetAtom(memoListAtom);

  // エディタに自動フォーカスを当てる
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current && activeTab === "text") {
        const editorElement = editorRef.current.querySelector(".ProseMirror");
        if (editorElement instanceof HTMLElement) {
          editorElement.focus();
        }
      }
    }, 100); // エディタのマウントを待つ

    return () => clearTimeout(timer);
  }, [activeTab]); // currentThemeIndexを依存関係から削除

  // DBからタブ状態を復元
  useEffect(() => {
    (async () => {
      try {
        const settings = await fetchSettings();
        if (
          settings?.last_selected_input_type === "text" ||
          settings?.last_selected_input_type === "drawing"
        ) {
          setActiveTab(settings.last_selected_input_type);
        }
      } catch (e) {
        // 取得失敗時は何もしない
      }
    })();
  }, []);

  // タブ切り替え時にDBへ保存
  const handleTabChange = useCallback(async (tabId: string) => {
    setActiveTab(tabId);
    try {
      // 既存設定を取得
      const settings = await fetchSettings();
      await updateSettings(
        settings?.theme_count ?? 10,
        settings?.time_limit ?? "60",
        tabId
      );
    } catch (e) {
      // 保存失敗時は何もしない
    }
  }, []);

  const handleThemeChange = useCallback(
    (nextIndex: number) => {
      setTextContent("");
      setDrawingContent("");
      setCurrentTheme(themes[nextIndex]);
      setCurrentThemeIndex(nextIndex);

      if (hasDrawingInput) {
        handleTabChange("drawing");
        setHasDrawingInput(false);
      } else {
        handleTabChange("text");
      }
    },
    [themes, hasDrawingInput, handleTabChange]
  );

  // 描画内容が変更されたときに描画入力フラグを設定
  const handleDrawingChange = useCallback((value: string) => {
    setDrawingContent(value);
    if (value?.trim()) {
      setHasDrawingInput(true);
    }
  }, []);

  const saveTextMemo = useCallback(async () => {
    if (currentTheme && textContent.trim()) {
      try {
        const responseData = await ky
          .put("/api/memos", {
            json: {
              content: textContent,
              theme_id: currentTheme.id,
            },
          })
          .json<Memo>();

        // 状態を更新
        setMemoList((prev) => {
          // 同じテーマの既存メモを探す
          const existingMemoIndex = prev.findIndex(
            (memo) => memo.theme.id === currentTheme.id
          );

          const newMemo = {
            id: responseData.id,
            content: textContent,
            created_at: responseData.created_at,
            local_created_at: responseData.created_at,
            theme: currentTheme,
          };

          if (existingMemoIndex !== -1) {
            // 既存のメモを更新
            const updatedMemos = [...prev];
            updatedMemos[existingMemoIndex] = newMemo;

            // recentMemosも更新
            setRecentMemos((recentPrev) => {
              const recentExistingIndex = recentPrev.findIndex(
                (memo) => memo.theme.id === currentTheme.id
              );
              if (recentExistingIndex !== -1) {
                const updatedRecent = [...recentPrev];
                updatedRecent[recentExistingIndex] = newMemo;
                return updatedRecent;
              }
              return [...recentPrev, newMemo];
            });

            return updatedMemos;
          }
          // 新しいメモを追加
          setRecentMemos((prev) => [...prev, newMemo]);
          return [...prev, newMemo];
        });
      } catch (error) {
        console.error("テキストメモの保存に失敗しました:", error);
        throw error;
      }
    }
  }, [currentTheme, textContent, setMemoList, setRecentMemos]);

  const saveDrawingMemo = useCallback(async () => {
    if (currentTheme && drawingContent) {
      try {
        console.log("Saving drawing memo:", {
          title: "描画メモ",
          content: drawingContent,
          theme_id: currentTheme.id,
        });

        const responseData = await ky
          .put("/api/memos", {
            json: {
              title: "描画メモ",
              content: drawingContent,
              theme_id: currentTheme.id,
            },
          })
          .json<Memo>();

        console.log("Server response:", responseData);

        // 状態を更新
        setMemoList((prev) => {
          // 同じテーマの既存メモを探す
          const existingMemoIndex = prev.findIndex(
            (memo) => memo.theme.id === currentTheme.id
          );

          const newMemo = {
            id: responseData.id,
            title: "描画メモ",
            content: responseData.content,
            created_at: responseData.created_at,
            local_created_at: responseData.created_at,
            theme: currentTheme,
          };

          if (existingMemoIndex !== -1) {
            // 既存のメモを更新
            const updatedMemos = [...prev];
            updatedMemos[existingMemoIndex] = newMemo;

            // recentMemosも更新
            setRecentMemos((recentPrev) => {
              const recentExistingIndex = recentPrev.findIndex(
                (memo) => memo.theme.id === currentTheme.id
              );
              if (recentExistingIndex !== -1) {
                const updatedRecent = [...recentPrev];
                updatedRecent[recentExistingIndex] = newMemo;
                return updatedRecent;
              }
              return [...recentPrev, newMemo];
            });

            return updatedMemos;
          }
          // 新しいメモを追加
          console.log("Adding new memo to recentMemos:", newMemo);
          setRecentMemos((prev) => {
            const updated = [...prev, newMemo];
            console.log("Updated recentMemos:", updated);
            return updated;
          });
          return [...prev, newMemo];
        });
      } catch (error) {
        console.error("描画メモの保存に失敗しました:", error);
        throw error;
      }
    }
  }, [currentTheme, drawingContent, setMemoList, setRecentMemos]);

  const { remainingTime, startTimer } = useThemeTimer(
    Number(themeTime),
    themes.length,
    currentThemeIndex,
    async () => {
      // テキストと描画の両方を保存
      await saveTextMemo();
      await saveDrawingMemo();
    },
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

      <div className="px-4">
        <Tab
          tabs={[
            {
              id: "text",
              content: (
                <div ref={editorRef}>
                  <Tiptap value={textContent} onChange={setTextContent} />
                </div>
              ),
              label: "タイプ入力する",
            },
            {
              id: "drawing",
              content: (
                <Drawing
                  value={drawingContent}
                  onChange={handleDrawingChange}
                  currentTheme={currentTheme}
                  remainingTime={remainingTime}
                />
              ),
              label: "手書きする",
            },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
    </>
  );
};

export default MemoEditorPage;
