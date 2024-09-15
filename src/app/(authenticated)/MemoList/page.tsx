import Link from "next/link";

import { getThemes } from "@/pages/api/themes";
import { Memo } from "@/types/memo";

const PostList = ({ memos }: { memos: Memo[] }) => {
  return (
    <div className="px-12">
      {memos.map((memo, index) => (
        <div className="line-clamp-1" key={index}>
          <Link href={`/MemoViewer/${memo.id}`}>{memo.theme}</Link>
        </div>
      ))}
    </div>
  );
};

export default async function Home() {
  const themes = await getThemes(); // Supabaseからデータを取得

  return (
    <div>
      <h1>無限スクロールのデモ</h1>
      <PostList memos={themes} />
    </div>
  );
}
