import Link from "next/link";

import Button from "@/component/Button";


export default async function Home() {

  return (
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
  );
}
