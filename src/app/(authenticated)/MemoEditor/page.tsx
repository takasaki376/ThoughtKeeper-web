"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import { Drawing } from "@/component/Drawing";
import { Loader } from "@/component/Loader";
import { Tab } from "@/component/Tab";
import { Tiptap } from "@/component/TipTap";
import { useMemos } from "@/hooks/useMemos";
import { useSettings } from "@/hooks/useSettings";
import { useThemeTimer } from "@/hooks/useThemeTimer";
import { recentMemosAtom, themeAtom } from "@/store";

const MemoEditorPage = () => {
  const themes = useAtomValue(themeAtom);
  const {
    settings,
    updateSettings,
    isLoading: isLoadingSettings,
  } = useSettings();
  const { updateMemo } = useMemos();
  const themeTime = settings?.time_limit ?? "60";
  const setRecentMemos = useSetAtom(recentMemosAtom);
  const editorRef = useRef<HTMLDivElement>(null);

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(themes[0] || null);
  const [textContent, setTextContent] = useState("");
  const [drawingContent, setDrawingContent] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [hasDrawingInput, setHasDrawingInput] = useState(false);

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
    if (settings?.last_selected_input_type) {
      setActiveTab(settings.last_selected_input_type);
    }
  }, [settings]);

  // タブ切り替え時にDBへ保存
  const handleTabChange = useCallback(
    async (tabId: string) => {
      setActiveTab(tabId);
      await updateSettings({ last_selected_input_type: tabId });
    },
    [updateSettings]
  );

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
        const updatedMemo = await updateMemo({
          content: textContent,
          theme_id: currentTheme.id,
        });

        // recentMemosAtom を更新
        setRecentMemos((prev) => {
          const index = prev.findIndex(
            (m) => m.theme.id === updatedMemo.theme.id
          );
          if (index !== -1) {
            const newRecent = [...prev];
            newRecent[index] = updatedMemo;
            return newRecent;
          }
          return [...prev, updatedMemo];
        });
      } catch (error) {
        console.error("テキストメモの保存に失敗しました:", error);
      }
    }
  }, [currentTheme, textContent, updateMemo, setRecentMemos]);

  const saveDrawingMemo = useCallback(async () => {
    if (currentTheme && drawingContent) {
      try {
        const updatedMemo = await updateMemo({
          title: "描画メモ",
          content: drawingContent,
          theme_id: currentTheme.id,
        });

        // recentMemosAtom を更新
        setRecentMemos((prev) => {
          const index = prev.findIndex(
            (m) => m.theme.id === updatedMemo.theme.id
          );
          if (index !== -1) {
            const newRecent = [...prev];
            newRecent[index] = updatedMemo;
            return newRecent;
          }
          return [...prev, updatedMemo];
        });
      } catch (error) {
        console.error("描画メモの保存に失敗しました:", error);
      }
    }
  }, [currentTheme, drawingContent, updateMemo, setRecentMemos]);

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

  if (isLoadingSettings) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-5">
        <h2>テーマ</h2>
        <div className="flex flex-row items-baseline justify-center">
          <div className="mb-4 text-sm text-lightGray">
            {currentTheme ? (
              <p className="text-base font-semibold text-yellow-700">
                {currentTheme.title} : {currentTheme.theme}
              </p>
            ) : (
              <p className="text-sm">テーマが設定されていません</p>
            )}
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
