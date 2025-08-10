"use client";

import Link from "next/link";
import { useState } from "react";

import { SubmitButton } from "../login/submit-button";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const resetPassword = async (formData: FormData) => {
    try {
      const email = formData.get("email") as string;

      // バリデーション
      if (!email) {
        setMessage({ text: "メールアドレスを入力してください", type: "error" });
        return;
      }

      // メールアドレスの形式チェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage({
          text: "有効なメールアドレスを入力してください",
          type: "error",
        });
        return;
      }

      console.log("Attempting to send reset password email to:", email);

      const response = await fetch("/api/auth/reset-password", {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Reset password error:", data.error);
        setMessage({
          text: data.error || "パスワードリセットに失敗しました",
          type: "error",
        });
        return;
      }

      console.log("Password reset email sent successfully");
      setMessage({
        text: "パスワードリセット用のメールを送信しました。メールをご確認ください。",
        type: "success",
      });
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
      setMessage({ text: "予期しないエラーが発生しました。", type: "error" });
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

        {message && (
          <p
            className={`mt-4 p-4 text-center ${
              message.type === "success"
                ? "rounded border border-green-200 bg-green-50 text-green-600"
                : "rounded border border-red-200 bg-red-50 text-tomato"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
