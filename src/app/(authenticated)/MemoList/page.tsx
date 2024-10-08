// サーバーコンポーネントでデータ取得を行う
import { getThemes } from "@/pages/api/themes";
import { themes } from "@/types/database";

import MemoListPageClient from "./MemoListPageClient";

export default async function MemoListPage() {
  const theme = (await getThemes()) as themes; // Supabaseからデータを取得

  const count = theme.length;

  console.log("Server-side fetched themes:", theme); // サーバー側でデータをログ出力

  if (!theme) {
    console.error("No themes fetched or empty theme list.");
    return <div>Error: No themes available</div>;
  }

  return <MemoListPageClient memos={theme} count={count} />;
}
