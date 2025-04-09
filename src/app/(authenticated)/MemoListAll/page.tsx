"use client";
import { useAtomValue, useSetAtom } from "jotai";
import ky from "ky";
import { type FC, useEffect, useState } from "react";

import { memoListAtom } from "@/store";
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
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]); // フィルタリングされたメモのリストを管理
  const [themes, setThemes] = useState<{ id: string; theme: string }[]>([]); // テーマのステートを追加
  const [selectedTheme, setSelectedTheme] = useState<string>(""); // 選択されたテーマのステートを追加
  const memoList = useAtomValue(memoListAtom);
  const setMemoList = useSetAtom(memoListAtom);

  useEffect(() => {
    const fetchMemoList = async () => {
      try {
        const data = await ky.get("/api/memos").json<Memo[]>();
        setMemoList(data);
        setFilteredMemos(data);
        const uniqueThemes = Array.from(
          new Set(data.map((memo) => memo.theme.theme))
        );
        setThemes(
          uniqueThemes.map((theme) => ({
            id: theme,
            theme: theme,
          }))
        );
      } catch (error) {
        console.error("メモの取得に失敗しました:", error);
      }
    };
    fetchMemoList();
  }, [setMemoList]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);

      const filtered = memoList.filter((memo) => {
        const memoDate = new Date(memo.created_at);
        return memoDate >= selectedDate && memoDate < nextDate;
      });
      setFilteredMemos(filtered);
    } else {
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
      <DatePickerComponent onDateChange={handleDateChange} />
      <div className="flex flex-col items-center justify-center">
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
