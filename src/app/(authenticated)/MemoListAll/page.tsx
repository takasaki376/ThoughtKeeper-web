"use client";
import Image from "next/image";
import { type FC, useMemo, useState } from "react";

import { Loader } from "@/component/Loader";
import { useMemos } from "@/hooks/useMemos";
import type { Memo } from "@/types/database";

import DatePickerComponent from "./DatePicker";

// HTMLタグを除去し、改行を「/」で置き換える関数
const formatContent = (html: string) => {
  if (typeof window === "undefined") return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const paragraphs = Array.from(doc.body.querySelectorAll("p"))
    .map((p) => p.textContent || "")
    .filter((line) => line.trim() !== "");
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
  const { error, isLoading, memos } = useMemos();
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const filteredMemos = useMemo(() => {
    if (!memos) return [];

    let filtered = memos;

    if (filterDate) {
      const selectedDate = new Date(filterDate);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);
      filtered = filtered.filter((memo) => {
        const memoDate = new Date(memo.created_at);
        return memoDate >= selectedDate && memoDate < nextDate;
      });
    }

    if (selectedTheme) {
      filtered = filtered.filter((memo) => memo.theme.theme === selectedTheme);
    }

    return filtered;
  }, [memos, filterDate, selectedTheme]);

  const themes = useMemo(() => {
    const sourceMemos = filterDate ? filteredMemos : memos;
    if (!sourceMemos) return [];
    const uniqueThemes = Array.from(
      new Set(sourceMemos.map((memo) => memo.theme.theme))
    );
    return uniqueThemes.map((theme) => ({
      id: theme,
      theme: theme,
    }));
  }, [memos, filterDate, filteredMemos]);

  const handleDateChange = (date: Date | null) => {
    setFilterDate(date);
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(event.target.value);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>エラーが発生しました: {error.message}</div>;
  if (!memos) return <div>メモがありません。</div>;

  const reversedList = [...filteredMemos].reverse();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-5 flex items-center">
        <h1 className="text-xl font-bold">保存されたメモ</h1>
        <span className="ml-3 text-sm text-gray">
          ({filteredMemos.length}/{memos.length})
        </span>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <DatePickerComponent onDateChange={handleDateChange} memos={memos} />

        <div className="flex flex-col items-center">
          <label htmlFor="theme-select" className="sr-only">
            テーマ選択
          </label>
          <select
            id="theme-select"
            className="mb-5 w-full max-w-xs rounded border border-lightGray p-3 text-base"
            onChange={handleThemeChange}
            value={selectedTheme}
            style={{ fontSize: "16px" }}
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
