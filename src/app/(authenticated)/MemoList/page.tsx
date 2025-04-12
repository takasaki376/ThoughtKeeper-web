"use client";
import { useAtomValue } from "jotai";

import { countTheme, memoListAtom } from "@/store";
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
  const createdAt = new Date(memo.created_at);
  const date = createdAt.toLocaleDateString("ja-JP");
  const time = createdAt.toLocaleTimeString("ja-JP");
  return (
    <li key={`${date}-${time}-${memo.theme.theme}`} className="mb-4 list-none">
      <p className="text-sm text-gray">
        {date}: {time}
      </p>
      <p className="text-sm text-gray">{memo.theme.theme}</p>
      {/* メモの内容をフォーマットして表示 */}
      <p>{formatContent(memo.content)}</p>
    </li>
  );
};

export default function MemoListPage() {
  const memoList = useAtomValue(memoListAtom);
  const themeCount = useAtomValue(countTheme);

  // 最新のメモを取得（設定されたテーマ数分のみ）
  const currentSessionMemos = [...memoList]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, themeCount);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-5 text-xl font-bold">保存されたメモ</h1>
      <ul className="w-2/3 list-disc">
        {currentSessionMemos.map((memo) => (
          <MemoForView key={memo.id} memo={memo} />
        ))}
      </ul>
    </div>
  );
}
