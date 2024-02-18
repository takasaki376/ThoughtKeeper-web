// pages/index.tsx
"use client";

import useSWRInfinite from "swr/infinite";

import { Memo } from "@/types/memo";

import { memos } from "../api/memos";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostList({ memos }: { memos: Memo[] }) {
  return (
    <div>
      {memos.map((memo) => (
        <div className="line-clamp-1" key={memo.title}>
          {memo.memo}
        </div>
      ))}
    </div>
  );
}

function InfiniteScroll() {
  const getKey = (pageIndex: number, previousPageData: Memo[]) => {
    if (previousPageData && !previousPageData.length) return null; // 最後に到達した
    return `/api/memos?page=${pageIndex + 1}`; // SWR キー
  };

  const { data, error, setSize, size } = useSWRInfinite(getKey, fetcher);

  // const posts = data ? data.flat() : [];

  if (error) return <div>エラーが発生しました。</div>;
  if (!data) return <div>データを取得中...</div>;

  return (
    <div>
      <PostList memos={memos} />
      <button onClick={() => setSize(size + 1)}>次のページ</button>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <h1>無限スクロールのデモ</h1>
      <InfiniteScroll />
    </div>
  );
}
