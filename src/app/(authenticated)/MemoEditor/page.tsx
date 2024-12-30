"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Tiptap } from "@/component/TipTap";
import { countTime, memoListAtom, themeAtom } from "@/store/setting";
import { Memo } from "@/types/database";

const MemoEditorPage = () => {
  const router = useRouter();
  const themes = useAtomValue(themeAtom);
  const themeTime = useAtomValue(countTime);

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(themes[0] || null);
  const [remainingTime, setRemainingTime] = useState(Number(themeTime));
  const [inputContent, setInputContent] = useState("");
  const setMemoList = useSetAtom(memoListAtom);

  // 入力内容を保存するための参照を使用
  const inputContentRef = useRef(inputContent);
  inputContentRef.current = inputContent;

  const saveMemo = async () => {
    if (currentTheme && inputContentRef.current) {
      const response = await fetch(`/api/memos`, {
        body: JSON.stringify({
          content: inputContentRef.current,
          theme_id: currentTheme.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("メモの保存に失敗しました");
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error("空のレスポンスが返されました");
      }

      const responseData: Memo = JSON.parse(responseText);

      // created_atからDateオブジェクトを作成
      const createdAt = new Date(responseData.created_at);

      // 日付と時刻を日本のフォーマットで取得
      const currentDate = createdAt.toLocaleDateString("ja-JP");
      const currentTime = createdAt.toLocaleTimeString("ja-JP");

      // 状態を更新
      setMemoList((prev) => {
        const isAlreadySaved = prev.some(
          (memo) =>
            memo.theme === currentTheme.theme &&
            memo.content === inputContentRef.current
        );

        if (!isAlreadySaved) {
          console.log("Memo saved to DB:", inputContentRef.current);
          return [
            ...prev,
            {
              content: inputContentRef.current,
              date: currentDate,
              theme: currentTheme.theme,
              time: currentTime,
            },
          ];
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 1) {
          // 残り時間が0になったら次のテーマに切り替え
          const nextIndex = (currentThemeIndex + 1) % themes.length;
          const nextTheme = themes[nextIndex];

          // メモを保存
          saveMemo();

          // 入力フィールドをクリア
          setInputContent("");

          // 次のテーマに切り替える
          setCurrentTheme(nextTheme);
          setCurrentThemeIndex(nextIndex);

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
  }, [themeTime, currentThemeIndex]);

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
};
export default MemoEditorPage;
