import Link from "next/link";
import { redirect } from "next/navigation";

import Button from "@/component/Button";
import { createClient } from "@/utils/supabase/server";

import AuthButton from "./auth/_button/AuthButton";

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }
  return (
    <div className="mx-auto flex h-1/2 w-40 flex-col content-center justify-around">
      <AuthButton />
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
  );
}
