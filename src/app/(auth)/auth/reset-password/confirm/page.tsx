import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";

import { SubmitButton } from "../../login/submit-button";

export default function ResetPasswordConfirmPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const updatePassword = async (formData: FormData) => {
    "use server";

    try {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      const supabase = createSupabaseServerClient();

      // パスワード確認
      if (password !== confirmPassword) {
        return redirect(
          "/auth/reset-password/confirm?message=Passwords do not match"
        );
      }

      // パスワードの強度チェック
      if (password.length < 8) {
        return redirect(
          "/auth/reset-password/confirm?message=Password must be at least 8 characters long"
        );
      }

      console.log("Attempting to update password");

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Update password error:", error);
        return redirect(
          `/auth/reset-password/confirm?message=${error.message}`
        );
      }

      return redirect("/auth/reset-password/success");
    } catch (error) {
      console.error("Unexpected error during password update:", error);
      return redirect(
        "/auth/reset-password/confirm?message=An unexpected error occurred"
      );
    }
  };

  return (
    <div className="flex justify-center gap-2 px-8">
      <div className="flex w-full flex-col gap-2 text-foreground md:w-1/2">
        <h1 className="mb-6 text-2xl font-bold">新しいパスワードを設定</h1>
        <p className="text-gray-600 mb-6 text-sm">
          新しいパスワードを入力してください。
        </p>

        <form className="flex flex-col gap-2">
          <label className="text-base" htmlFor="password">
            新しいパスワード
          </label>
          <input
            className="mb-4 rounded-md border bg-inherit px-4 py-2"
            type="password"
            name="password"
            placeholder="••••••••"
            minLength={8}
            required
          />

          <label className="text-base" htmlFor="confirmPassword">
            パスワード確認
          </label>
          <input
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            minLength={8}
            required
          />

          <SubmitButton
            formAction={updatePassword}
            className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
            pendingText="更新中..."
          >
            パスワードを更新
          </SubmitButton>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-blue-600 hover:underline"
          >
            ログインページに戻る
          </Link>
        </div>

        {searchParams?.message && (
          <p className="mt-4 p-4 text-center text-tomato">
            {searchParams.message}
          </p>
        )}
      </div>
    </div>
  );
}
