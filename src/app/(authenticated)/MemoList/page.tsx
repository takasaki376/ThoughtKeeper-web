"use client";
import Link from "next/link";

import { getThemes } from "@/pages/api/themes";
import { themes } from "@/types/database";

const PostList = ({
  memos,
}: {
  memos: { id: string; title: string; theme: string }[];
}) => {
  return (
    <div className="px-12">
      {memos.map((memo) => (
        <div className="line-clamp-1" key={memo.id}>
          <Link href={`/MemoViewer/${memo.id}`}>
            {memo.title}：{memo.theme}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default async function MemoListPage() {
  const theme = (await getThemes()) as themes; // Supabaseからデータを取得
  const count = theme.length;
  return (
    <div>
      <h1>Supabaseからデータを表示</h1>
      <div>テーマ数：{count}</div>
      <PostList memos={theme} />
    </div>
  );
}
