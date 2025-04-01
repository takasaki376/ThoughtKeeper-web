"use client";
import { type FC, useEffect, useState } from "react";

import type { Memo } from "@/types/database";

import DatePickerComponent from "./DatePicker";

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

const MemoListAllPage: FC = () => {
  const [memoList, setMemoList] = useState<Memo[]>([]); // メモのリストを管理
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]); // フィルタリングされたメモのリストを管理
  const [filterDate, setFilterDate] = useState(""); // フィルタリング用の日付
  const [themes, setThemes] = useState<{ id: string; theme: string }[]>([]); // テーマのステートを追加
  const [selectedTheme, setSelectedTheme] = useState<string>(""); // 選択されたテーマのステートを追加

  useEffect(() => {
    const fetchMemoList = async () => {
      const response = await fetch("/api/memos"); // メモを取得するAPIを呼び出し
      const data = await response.json();
      setMemoList(data); // メモリストを更新
      setFilteredMemos(data); // 初期状態で全メモを表示
      const uniqueThemes = Array.from(
        new Set(data.map((memo: Memo) => memo.theme.theme))
      ); // ユニークなテーマを取得
      setThemes(
        uniqueThemes.map((theme) => ({
          id: theme as string,
          theme: theme as string,
        }))
      ); // テーマをオブジェクト形式で設定
    };
    fetchMemoList(); // メモリストを取得
  }, []); // コンポーネントのマウント時にデータを取得

  const handleFilterChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = event.target.value;
    setFilterDate(date);

    if (date) {
      // 選択された日付の開始と終了を設定
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);

      // フィルタリングを実行
      const filtered = memoList.filter((memo) => {
        const memoDate = new Date(memo.created_at);
        return memoDate >= selectedDate && memoDate < nextDate;
      });
      setFilteredMemos(filtered);
    } else {
      // 日付フィルターがクリアされた場合は全てのメモを表示
      setFilteredMemos(memoList);
    }
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedTheme(selected); // 選択されたテーマを更新
    // テーマでフィルタリング
    const filtered =
      selected === ""
        ? memoList
        : memoList.filter((memo) => memo.theme.theme === selected);
    setFilteredMemos(filtered); // フィルタリングされたメモを更新
  };

  // 配列であることを確認
  const reversedList = Array.isArray(filteredMemos)
    ? [...filteredMemos].reverse()
    : [];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-5 flex items-center">
        <h1 className="text-xl font-bold">保存されたメモ</h1>
        <span className="ml-3 text-sm text-gray">
          ({filteredMemos.length}/{memoList.length})
        </span>
      </div>
      <DatePickerComponent />
      <div className="flex flex-col items-center justify-center">
        {/* 日付フィルター入力 */}
        <label htmlFor="date-filter" className="sr-only">
          日付フィルター
        </label>
        <input
          id="date-filter"
          type="date"
          value={filterDate}
          onChange={handleFilterChange}
          className="mr-2 rounded border border-lightGray p-2"
          placeholder="日付を選択"
        />

        {/* テーマ選択ドロップボックス */}
        <label htmlFor="theme-select" className="sr-only">
          テーマ選択
        </label>
        <select
          id="theme-select"
          className="my-4 rounded border border-lightGray p-2"
          onChange={handleThemeChange}
          value={selectedTheme}
        >
          <option value="">全て表示</option> {/* 初期値として全て表示を追加 */}
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.theme} {/* theme.titleをtheme.themeに変更 */}
            </option>
          ))}
        </select>
      </div>

      <ul className="w-2/3 list-disc">
        {reversedList.map((memo: Memo) => (
          <li
            key={`${memo.created_at}-${memo.theme.theme}`}
            className="mb-4 list-none"
          >
            <p className="text-center text-xs font-extralight text-gray">
              {formatDate(memo.created_at)}
            </p>
            <p className="my-2 w-full text-xs font-thin">
              {memo.title} - {memo.theme.theme}
            </p>
            <p className="w-full break-words">{formatContent(memo.content)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoListAllPage;
