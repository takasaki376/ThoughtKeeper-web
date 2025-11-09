import "@/styles/globals.scss";

import { redirect } from "next/navigation";

import { Header } from "@/component/Header";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const metadata = {
  title: "パスワードリセット確認 - ThoughtKeeper",
  description: "パスワードリセット確認ページ",
};

export default async function ResetPasswordConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 既にログインしている場合は設定ページにリダイレクト
  // （ログイン済みユーザーは設定ページから直接パスワードを変更する）
  if (user) {
    return redirect("/setting");
  }

  return (
    <html lang="ja">
      <body>
        <Header />
        <div className="flex justify-center">
          <div className="min-h-screen w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
