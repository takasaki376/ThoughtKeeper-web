"use client";
import { useEffect, useState } from "react";

import { fetchMemos } from "@/services/memosService";

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

interface Memo {
  content: string;
  date: string;
  theme: string;
  time: string;
}

export default function MemoListAllPage() {
  const [memoList, setMemoList] = useState<Memo[]>([]); // DBから取得したメモを格納するステート

  useEffect(() => {
    const fetchMemoList = async () => {
      try {
        const data = await fetchMemos(); // fetchMemosを使用してデータを取得
        setMemoList(data); // 取得したデータをステートに設定
      } catch (error) {
        console.error("メモの取得に失敗しました:", error);
      }
    };

    fetchMemoList();
  }, []); // コンポーネントのマウント時にデータを取得
  const reversedList = memoList.toReversed();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-5 text-xl font-bold">保存されたメモ</h1>
      <ul className="w-2/3 list-disc">
        {reversedList.map((memo) => (
          <li key={`${memo.date}-${memo.time}-${memo.theme}`} className="mb-4">
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
