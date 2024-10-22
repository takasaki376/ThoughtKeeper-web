"use client";
import { useAtomValue } from "jotai";

import { memoListAtom } from "@/store/setting";

// HTMLタグを除去する関数
const stripHTML = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
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
            {/* HTMLタグを除去したメモの内容を表示 */}
            <p>{stripHTML(memo.content)} / </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
