// pages/index.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import { memos } from "@/pages/api/memos";
import { Memo } from "@/types/memo";
import { createClient } from "@/utils/supabase/server";

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

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }
  return (
    <div>
      <h1>無限スクロールのデモ</h1>
      <PostList memos={memos} />
    </div>
  );
}
