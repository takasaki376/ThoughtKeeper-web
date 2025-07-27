import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";

import { SubmitButton } from "../login/submit-button";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const resetPassword = async (formData: FormData) => {
    "use server";

    try {
      const email = formData.get("email") as string;
      const origin = headers().get("origin");
      const supabase = createSupabaseServerClient();

      console.log("Attempting to send reset password email to:", { email });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password/confirm`,
      });

      if (error) {
        console.error("Reset password error:", error);
        return redirect(`/auth/reset-password?message=${error.message}`);
      }

      return redirect(
        "/auth/reset-password?message=Check your email for the password reset link"
      );
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
      return redirect(
        "/auth/reset-password?message=An unexpected error occurred"
      );
    }
  };

  return (
    <div className="flex justify-center gap-2 px-8">
      <div className="flex w-full flex-col gap-2 text-foreground md:w-1/2">
        <h1 className="mb-6 text-2xl font-bold">パスワードをリセット</h1>
        <p className="text-gray-600 mb-6 text-sm">
          登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
        </p>

        <form className="flex flex-col gap-2">
          <label className="text-base" htmlFor="email">
            メールアドレス
          </label>
          <input
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <SubmitButton
            formAction={resetPassword}
            className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
            pendingText="送信中..."
          >
            リセットリンクを送信
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
