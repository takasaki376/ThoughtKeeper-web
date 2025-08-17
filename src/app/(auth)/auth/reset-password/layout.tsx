import "@/styles/globals.scss";

import { redirect } from "next/navigation";

import { Header } from "@/component/Header";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const metadata = {
  title: "パスワードリセット - ThoughtKeeper",
  description: "パスワードリセットページ",
};

export default async function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 既にログインしている場合はホームページにリダイレクト
  if (user) {
    return redirect("/");
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
