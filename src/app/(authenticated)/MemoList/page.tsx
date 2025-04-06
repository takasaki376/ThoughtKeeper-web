"use client";
import { useAtomValue } from "jotai";

import { memoListAtom } from "@/store";
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
  createdAt.setHours(createdAt.getHours() + 9);
  const date = createdAt.toLocaleDateString("ja-JP");
  const time = createdAt.toLocaleTimeString("ja-JP");
  return (
    <li key={`${date}-${time}-${memo.theme}`} className="mb-4 list-none">
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
  const memoList = useAtomValue(memoListAtom); // 保存されたメモを取得
  const reversedList = [...memoList].reverse(); // 配列を逆順にする

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-5 text-xl font-bold">保存されたメモ</h1>
      <ul className="w-2/3 list-disc">
        {reversedList.map((memo) => (
          <MemoForView key={memo.id} memo={memo} />
        ))}
      </ul>
    </div>
  );
}
