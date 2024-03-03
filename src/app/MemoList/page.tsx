// pages/index.tsx
"use client";

import Link from "next/link";
import useSWRInfinite from "swr/infinite";

import { memos } from "@/pages/api/memos";
import { Memo } from "@/types/memo";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PostList = ({ memos }: { memos: Memo[] }) => {
  if (memos) {
    return (
      <div className="px-12">
        {memos.map((memo, index) => (
          <div className="line-clamp-1" key={index}>
            <Link href={`/MemoViewer/${memo.id}`}>{memo.theme}</Link>
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

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
