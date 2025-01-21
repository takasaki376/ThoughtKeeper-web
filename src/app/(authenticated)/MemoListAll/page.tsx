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

// 日付を日本時間でフォーマットする関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月は0から始まるため1を加算
  const day = date.getDate();
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo", // 日本時間
    weekday: "short",
  };
  const time = date.toLocaleString("ja-JP", options).split(" ")[1]; // 時間部分を取得
  return `${year}/${month}/${day} ${time}`; // フォーマットを「YYYY/MM/DD HH:mm」に
};

interface Memo {
  content: string;
  created_at: string;
  date: string;
  theme: {
    id: string;
    title: string;
    theme: string;
  };
  theme_id: string;
  time: string;
}

export default function MemoListAllPage() {
  const [memoList, setMemoList] = useState<Memo[]>([]); // DBから取得したメモを格納するステート
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]); // フィルタリングされたメモを格納するステート
  const [filterDate, setFilterDate] = useState(""); // フィルタリング用の日付

  useEffect(() => {
    const fetchMemoList = async () => {
      try {
        const data = await fetchMemos(); // fetchMemosを使用してデータを取得
        setMemoList(data); // 取得したデータをステートに設定
        setFilteredMemos(data); // 初期状態では全メモを表示
      } catch (error) {
        console.error("メモの取得に失敗しました:", error);
      }
    };

    fetchMemoList();
  }, []); // コンポーネントのマウント時にデータを取得

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setFilterDate(date);
    // 日付でフィルタリング
    const filtered = memoList.filter((memo) => {
      const memoDate = new Date(memo.created_at).toISOString().split("T")[0]; // created_atを使用
      return memoDate === date; // フィルタリング条件
    });
    setFilteredMemos(filtered);
  };

  const reversedList = filteredMemos.toReversed();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-5 text-xl font-bold">保存されたメモ</h1>

      {/* 日付フィルター入力 */}
      <input
        type="date"
        value={filterDate}
        onChange={handleFilterChange}
        className="mb-4 rounded border border-lightGray p-2"
      />

      <ul className="w-2/3 list-disc">
        {reversedList.map((memo) => (
          <li
            key={`${memo.date}-${memo.time}-${memo.theme.title}`}
            className="mb-4 list-none"
          >
            <p className="text-center text-xs font-extralight text-gray">
              {formatDate(memo.created_at)}
            </p>
            <p className="my-2 text-xs font-thin">
              {memo.theme.title} - {memo.theme.theme}
            </p>
            <p>{formatContent(memo.content)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
