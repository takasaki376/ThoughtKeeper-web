"use client";

import { Loader } from "@/component/Loader";
import { useGetThemes } from "@/hooks/useGetThemes";

import MemoListPageClient from "./MemoListPageClient";

export default function MemoListPage() {
  const { error, loading, themes } = useGetThemes(); // フックを使用してデータを取得

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return <MemoListPageClient memos={themes} count={themes.length} />;
}
