"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { SubmitButton } from "../../login/submit-button";
import { updatePassword } from "./actions";

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // リアルタイムバリデーション
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatchMessage("パスワードが一致しません");
      setShowMessage(true);
    } else if (confirmPassword && password === confirmPassword) {
      setPasswordMatchMessage("パスワードが一致しました✅");
      setShowMessage(false);
    } else {
      setShowMessage(false);
    }
  }, [password, confirmPassword]);

  // デバッグ情報
  console.log("ResetPasswordConfirmPage - searchParams:", searchParams);

  // トークンとタイプの確認（codeパラメータも考慮）
  const code = searchParams?.get("code");
  const token = searchParams?.get("token");
  const type = searchParams?.get("type");
  const message = searchParams?.get("message");

  // codeパラメータがある場合は、Supabaseの認証フローを処理
  if (code) {
    console.log("Processing auth code:", code);
    // クライアントサイドでは認証処理を行わないため、フォームを表示
  }

  // エラー状態を管理
  let hasError = false;
  let errorMessage = "";

  // 従来のtoken/typeフロー（codeパラメータがない場合のみ）
  if (!code && (!token || type !== "recovery")) {
    console.log("Invalid token or type:", { token, type });
    hasError = true;
    errorMessage =
      "無効なリセットリンクです。パスワードリセットを再度実行してください。";
  }

  // トークンの有効性をチェック（token/typeフローの場合のみ）
  if (!code && token && (!token || token.length < 10)) {
    console.log("Token too short:", token);
    hasError = true;
    errorMessage =
      "無効なリセットリンクです。パスワードリセットを再度実行してください。";
  }

  // トークンに無効な文字が含まれていないかチェック（token/typeフローの場合のみ）
  if (
    !code &&
    token &&
    (token.includes("\n") || token.includes("\r") || token.includes("\t"))
  ) {
    console.log("Token contains invalid characters:", token);
    hasError = true;
    errorMessage =
      "無効なリセットリンクです。パスワードリセットを再度実行してください。";
  }

  // エラーがある場合は、エラーメッセージを表示してフォームは表示しない
  if (hasError) {
    return (
      <div className="flex justify-center gap-2 px-8">
        <div className="flex w-full flex-col gap-2 text-foreground md:w-1/2">
          <h1 className="mb-6 text-2xl font-bold">エラー</h1>
          <p className="mb-6 text-tomato">{errorMessage}</p>
          <div className="mt-4 text-center">
            <Link
              href="/auth/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              パスワードリセットを再度実行
            </Link>
          </div>
        </div>
      </div>
    );
  }

  console.log("Validation passed, showing password form");
  console.log("Final state - code:", code, "token:", type, "type:", type);

  // Server Actionを呼び出すためのラッパー関数
  const handleUpdatePassword = async (formData: FormData) => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      console.log("Starting password update...");
      console.log("Form data:", {
        confirmPassword: formData.get("confirmPassword"),
        password: formData.get("password"),
      });
      console.log("Context:", { code, token, type });

      await updatePassword(formData, code, token, type);
    } catch (error) {
      console.error("Client-side error during password update:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setUpdateError(errorMessage);
      setIsUpdating(false);
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
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
            disabled={isUpdating}
          />

          <label className="text-base" htmlFor="confirmPassword">
            パスワード確認
          </label>
          <input
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
            disabled={isUpdating}
          />

          {/* リアルタイムバリデーションメッセージ */}
          {showMessage && (
            <div className="mb-4 text-sm">
              <p
                className={
                  passwordMatchMessage.includes("一致しました")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {passwordMatchMessage}
              </p>
            </div>
          )}

          <div className="text-gray-500 mb-4 text-xs">
            <p>パスワードは以下の条件を満たす必要があります：</p>
            <ul className="list-disc pl-4">
              <li>8文字以上</li>
              <li>小文字を含む</li>
              <li>大文字を含む</li>
              <li>数字を含む</li>
            </ul>
          </div>

          {/* クライアントサイドエラーメッセージ */}
          {updateError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">
                エラーが発生しました: {updateError}
              </p>
            </div>
          )}

          <SubmitButton
            formAction={handleUpdatePassword}
            className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground disabled:opacity-50"
            pendingText="更新中..."
            disabled={isUpdating}
          >
            {isUpdating ? "更新中..." : "パスワードを更新"}
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
          <p className="mt-4 p-4 text-center text-tomato">
            {decodeURIComponent(message)}
          </p>
        )}

        {/* デバッグ情報（開発環境のみ） */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 mt-4 rounded-md p-3 text-xs">
            <p className="mb-2 font-semibold">デバッグ情報:</p>
            <p>Code: {code || "なし"}</p>
            <p>Token: {token || "なし"}</p>
            <p>Type: {type || "なし"}</p>
            <p>Message: {message || "なし"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
