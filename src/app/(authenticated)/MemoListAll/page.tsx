"use client";
import { useAtomValue, useSetAtom } from "jotai";
import ky from "ky";
import Image from "next/image";
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

// 日付をローカルタイムゾーンでフォーマットする関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: "short",
  };
  const time = date.toLocaleString("ja-JP", options).split(" ")[1];
  return `${year}/${month}/${day} ${time}`;
};

// 時間をローカルタイムゾーンでフォーマットする関数
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const MemoListAllPage: FC = () => {
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]); // フィルタリングされたメモのリストを管理
  const [themes, setThemes] = useState<{ id: string; theme: string }[]>([]); // テーマのステートを追加
  const [selectedTheme, setSelectedTheme] = useState<string>(""); // 選択されたテーマのステートを追加
  const [filterDate, setFilterDate] = useState<Date | null>(null); // 選択された日付のステートを追加
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
    setFilterDate(date);
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);

      const filtered = memoList.filter((memo) => {
        const memoDate = new Date(memo.created_at);
        const dateMatch = memoDate >= selectedDate && memoDate < nextDate;
        const themeMatch =
          selectedTheme === "" || memo.theme.theme === selectedTheme;
        return dateMatch && themeMatch;
      });
      setFilteredMemos(filtered);

      // 選択された日付のメモに含まれるテーマのみを抽出
      const dateThemes = Array.from(
        new Set(filtered.map((memo) => memo.theme.theme))
      );
      setThemes(
        dateThemes.map((theme) => ({
          id: theme,
          theme: theme,
        }))
      );
    } else {
      // 日付が選択されていない場合は、全てのテーマを表示
      const allThemes = Array.from(
        new Set(memoList.map((memo) => memo.theme.theme))
      );
      setThemes(
        allThemes.map((theme) => ({
          id: theme,
          theme: theme,
        }))
      );

      // テーマでのみフィルタリング
      const filtered =
        selectedTheme === ""
          ? memoList
          : memoList.filter((memo) => memo.theme.theme === selectedTheme);
      setFilteredMemos(filtered);
    }
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedTheme(selected);

    // 日付が選択されている場合は、日付とテーマの両方でフィルタリング
    if (filterDate) {
      const selectedDate = new Date(filterDate);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);

      const filtered = memoList.filter((memo) => {
        const memoDate = new Date(memo.created_at);
        const dateMatch = memoDate >= selectedDate && memoDate < nextDate;
        const themeMatch = selected === "" || memo.theme.theme === selected;
        return dateMatch && themeMatch;
      });
      setFilteredMemos(filtered);
    } else {
      // 日付が選択されていない場合は、テーマでのみフィルタリング
      const filtered =
        selected === ""
          ? memoList
          : memoList.filter((memo) => memo.theme.theme === selected);
      setFilteredMemos(filtered);
    }
  };

  // 配列であることを確認
  const reversedList = Array.isArray(filteredMemos)
    ? [...filteredMemos].reverse()
    : [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-5 flex items-center">
        <h1 className="text-xl font-bold">保存されたメモ</h1>
        <span className="ml-3 text-sm text-gray">
          ({filteredMemos.length}/{memoList.length})
        </span>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <DatePickerComponent onDateChange={handleDateChange} />

        {/* テーマ選択ドロップボックス */}
        <div className="flex flex-col items-center">
          <label htmlFor="theme-select" className="sr-only">
            テーマ選択
          </label>
          <select
            id="theme-select"
            className="mb-5 w-full max-w-xs rounded border border-lightGray p-3 text-base"
            onChange={handleThemeChange}
            value={selectedTheme}
            style={{ fontSize: "16px" }} // iPadでのズーム防止
          >
            <option value="">全て表示</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.theme}
              </option>
            ))}
          </select>
        </div>

        <div
          className="overflow-y-auto"
          style={{
            maxHeight: "60vh",
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <ul className="space-y-3">
            {reversedList.map((memo: Memo) => (
              <li
                key={`${memo.created_at}-${memo.theme.theme}`}
                className="list-none rounded-lg border border-lightGray bg-white p-4 shadow-sm"
              >
                <p className="text-center text-xs font-thin text-gray">
                  {formatDate(memo.created_at)}&nbsp;
                  {formatTime(memo.created_at)}
                </p>
                <p className="my-2 w-full text-xs font-thin">
                  {memo.title} - {memo.theme.theme}
                </p>
                {memo.content &&
                  (memo.content.startsWith("data:image") ? (
                    <div className="mt-2 overflow-hidden rounded">
                      <Image
                        src={memo.content}
                        alt="描画内容"
                        width={800}
                        height={300}
                        className="h-auto max-w-full rounded border border-lightGray"
                        style={{ touchAction: "manipulation" }}
                      />
                    </div>
                  ) : (
                    <p className="w-full break-words text-sm leading-relaxed">
                      {formatContent(memo.content)}
                    </p>
                  ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemoListAllPage;
