import Link from "next/link";

import Button from "@/component/Button";
import { createClient } from "@/utils/supabase/server";

import { InitializeSettings } from "./InitializeSettings";

export default async function Home() {
  const supabase = createClient();

  // ユーザー設定を取得
  const { data: userSettings } = await supabase
    .from("user_settings")
    .select("*")
    .single();

  return (
    <>
      <InitializeSettings
        theme_count={userSettings?.theme_count ?? 10}
        time_limit={userSettings?.time_limit ?? "60"}
      />
      <div className="mx-auto flex h-1/2 w-40 flex-col content-center justify-around">
        <Button>
          <Link href="/ThemeSelect">今日のメモ書き</Link>
        </Button>
        <Button>
          <Link href="/MemoList">過去のメモ書き</Link>
        </Button>
        <Button>
          <Link href="/setting">設定</Link>
        </Button>
      </div>
    </>
  );
}
