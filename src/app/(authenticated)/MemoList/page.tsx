"use client";
import { useAtomValue } from "jotai";

import { countTheme, recentMemosAtom, themeAtom } from "@/store";
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

const MemoForView = ({
  memo,
  theme,
}: {
  memo: Memo | null;
  theme: { id: string; theme: string };
}) => {
  if (!memo) {
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <li className="mb-4 list-none">
        <p className="text-sm text-gray">
          {formattedDate}: {formattedTime}
        </p>
        <p className="text-sm text-gray">{theme.theme}</p>
        <p className="text-sm text-gray">入力なし</p>
      </li>
    );
  }

  const date = new Date(memo.created_at);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <li
      key={`${formattedDate}-${formattedTime}-${memo.theme.theme}`}
      className="mb-4 list-none"
    >
      <p className="text-sm text-gray">
        {formattedDate}: {formattedTime}
      </p>
      <p className="text-sm text-gray">{memo.theme.theme}</p>
      {/* メモの内容をフォーマットして表示 */}
      <p>{formatContent(memo.content)}</p>
    </li>
  );
};

export default function MemoListPage() {
  const recentMemos = useAtomValue(recentMemosAtom);
  const themeCount = useAtomValue(countTheme);
  const themes = useAtomValue(themeAtom);

  // テーマごとの最新のメモを取得
  const themeMemos = themes.slice(0, themeCount).map((theme) => {
    const memoForTheme = recentMemos.find((memo) => memo.theme.id === theme.id);
    return memoForTheme || null;
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-5 text-xl font-bold">保存されたメモ</h1>
      <ul className="w-2/3 list-disc">
        {themeMemos.map((memo, index) => (
          <MemoForView
            key={themes[index].id}
            memo={memo}
            theme={themes[index]}
          />
        ))}
      </ul>
    </div>
  );
}
