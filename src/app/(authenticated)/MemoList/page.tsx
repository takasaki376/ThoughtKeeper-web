"use client";
import { useAtomValue } from "jotai";
import Image from "next/image";

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
      <li className="mb-4 list-none rounded-lg border border-lightGray bg-white p-3 shadow-sm">
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
      className="mb-4 list-none rounded-lg border border-lightGray bg-white p-3 shadow-sm"
    >
      <p className="text-sm text-gray">
        {formattedDate}: {formattedTime}
      </p>
      <p className="text-sm text-gray">{theme.theme}</p>
      {/* メモの内容をフォーマットして表示 */}
      {memo.content && memo.content.trim() !== "" ? (
        memo.content.startsWith("data:image") ? (
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
          <p className="mt-2 text-sm leading-relaxed">
            {formatContent(memo.content)}
          </p>
        )
      ) : (
        <p className="text-sm text-gray">入力なし</p>
      )}
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
    console.log("Found memo for theme:", theme.id, memoForTheme);
    return memoForTheme || null;
  });

  console.log("Recent memos:", recentMemos);
  console.log("Theme memos:", themeMemos);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-5 text-xl font-bold">保存されたメモ</h1>
      <div
        className="w-full max-w-2xl overflow-y-auto"
        style={{
          maxHeight: "70vh",
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <ul className="space-y-3">
          {themeMemos.map((memo, index) => (
            <MemoForView
              key={themes[index].id}
              memo={memo}
              theme={themes[index]}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
