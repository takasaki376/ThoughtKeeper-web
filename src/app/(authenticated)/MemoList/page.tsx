"use client";
import { useAtomValue } from "jotai";

import { memoListAtom } from "@/store/setting";

// HTMLタグを除去し、改行を「/」で置き換える関数
const formatContent = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");

  // <p> タグを取り除いてテキストのみを抽出
  const paragraphs = Array.from(doc.body.querySelectorAll("p"))
    .map((p) => p.textContent || "")
    .filter((line) => line.trim() !== "");

  // 改行を「/」で結合
  return paragraphs.join(" / ");
};

export default function MemoListPage() {
  const memoList = useAtomValue(memoListAtom); // 保存されたメモを取得
  const reversedList = memoList.toReversed();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-5 text-xl font-bold">保存されたメモ</h1>
      <ul className="w-2/3 list-disc">
        {reversedList.map((memo, index) => (
          <li key={index} className="mb-4">
            <p className="text-sm text-gray">
              日付: {memo.date}: {memo.time}
            </p>
            <p className="text-base font-semibold">テーマ: {memo.theme}</p>
            {/* メモの内容をフォーマットして表示 */}
            <p>{formatContent(memo.content)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
