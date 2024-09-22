import Link from "next/link";

import { getThemes } from "@/pages/api/themes";

const PostList = ({
  memos,
}: {
  memos: { id: string; title: string; theme: string }[];
}) => {
  return (
    <div className="px-12">
      {memos.map((memo) => (
        <div className="line-clamp-1" key={memo.id}>
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
      <h1>Supabaseからデータを表示</h1>
      <PostList memos={themes} />
    </div>
  );
}
