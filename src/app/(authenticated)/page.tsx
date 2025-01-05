"use client";

import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { Suspense, useEffect } from "react";

import Button from "@/component/Button";
import { Loader } from "@/component/Loader";
import { countTheme, countTime, getSetting } from "@/store/setting";

import { InitializeSettings } from "./InitializeSettings";

export default function Home() {
  const theme_count = useAtomValue(countTheme);
  const time_limit = useAtomValue(countTime);
  const setSettings = useSetAtom(getSetting);

  useEffect(() => {
    setSettings().catch(console.error);
  }, [setSettings]);

  return (
    <Suspense fallback={<Loader />}>
      <InitializeSettings
        theme_count={theme_count ?? 10}
        time_limit={time_limit ?? "60"}
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
    </Suspense>
  );
}
