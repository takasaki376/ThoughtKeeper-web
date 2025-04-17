"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

import { countTheme, recentMemosAtom } from "@/store";
import type { Memo } from "@/types/database";

// HTMLタグを除去し、改行を「/」で置き換える関数
const formatContent = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");

  // <p> タグを取り除いてテキストのみを抽出
  const paragraphs = Array.from(doc.body.querySelectorAll("p"))
    .map((p) => p.textContent || "")
    .filter((line) => line.trim() !== "");

  // 改行を「/」で結合
  return paragraphs.join(" ｜ ");
};

const MemoForView = ({ memo }: { memo: Memo }) => {
  const date = new Date(memo.local_created_at);
  const formattedDate = date.toLocaleDateString("ja-JP");
  const formattedTime = date.toLocaleTimeString("ja-JP");
  return (
    <li
      key={`${formattedDate}-${formattedTime}-${memo.theme.theme}`}
      className="mb-4 list-none"
    >
      <p className="text-sm text-gray">
        {formattedDate}: {formattedTime}
      </p>
      <p className="text-sm text-gray">{memo.theme.theme}</p>
      {/* メモの内容をフォーマットして表示 */}
      <p>{formatContent(memo.content)}</p>
    </li>
  );
};

export default function MemoListPage() {
  const recentMemos = useAtomValue(recentMemosAtom);
  const setRecentMemos = useSetAtom(recentMemosAtom);
  const themeCount = useAtomValue(countTheme);
  const lastDateRef = useRef<string | null>(null);

  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = new Date().toLocaleDateString();

      if (lastDateRef.current === null) {
        // 初回実行時は日付を保存
        lastDateRef.current = currentDate;
      } else if (lastDateRef.current !== currentDate) {
        // 日付が変わったらメモをクリア
        setRecentMemos([]);
        lastDateRef.current = currentDate;
      }
    };

    // 初回実行
    checkDateChange();

    // 1分ごとに日付をチェック
    const intervalId = setInterval(checkDateChange, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [setRecentMemos]);

  // 最新のメモを取得（作成日時の降順でソート）し、theme_countの件数分のみを表示
  const sortedMemos = [...recentMemos]
    .sort(
      (a, b) =>
        new Date(b.local_created_at).getTime() -
        new Date(a.local_created_at).getTime()
    )
    .slice(0, themeCount);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-5 text-xl font-bold">保存されたメモ</h1>
      <ul className="w-2/3 list-disc">
        {sortedMemos.map((memo) => (
          <MemoForView key={memo.id} memo={memo} />
        ))}
      </ul>
    </div>
  );
}
