"use client";
import Link from "next/link";

import { themes } from "@/types/database";

const PostList = ({ memos }: { memos: themes }) => {
  return (
    <div className="px-12">
      {memos.map((memo) => (
        <div className="line-clamp-1" key={memo.theme}>
          <Link href={`/MemoViewer/${memo.theme}`}>
            {memo.title}：{memo.theme}
          </Link>
        </div>
      ))}
    </div>
  );
};

// クライアントコンポーネント
export default function MemoListPageClient({
  count,
  memos,
}: {
  count: number;
  memos: themes;
}) {
  console.log("Client-side received memos:", memos); // クライアント側で受け取ったデータをログ出力

  if (!memos || memos.length === 0) {
    return <div>No memos to display</div>;
  }

  return (
    <div>
      <h1>Supabaseからデータを表示</h1>
      <div>テーマ数：{count}</div>
      <PostList memos={memos} />
    </div>
  );
}
