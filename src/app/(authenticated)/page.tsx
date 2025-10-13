"use client";

import Link from "next/link";
import { Suspense } from "react";

import Button from "@/component/Button";
import { Loader } from "@/component/Loader";

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="mx-auto flex h-1/2 w-40 flex-col content-center justify-around">
        <Button>
          <Link href="/ThemeSelect">今日のメモ書き</Link>
        </Button>
        <Button>
          <Link href="/MemoListAll">過去のメモ書き</Link>
        </Button>
        <Button>
          <Link href="/setting">設定</Link>
        </Button>
      </div>
    </Suspense>
  );
}
