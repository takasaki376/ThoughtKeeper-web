import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";

import { SubmitButton } from "../../login/submit-button";

export default async function ResetPasswordConfirmPage({
  searchParams,
}: {
  searchParams: {
    code?: string;
    message?: string;
    token?: string;
    type?: string;
  };
}) {
  // デバッグ情報
  console.log("ResetPasswordConfirmPage - searchParams:", searchParams);

  // トークンとタイプの確認（codeパラメータも考慮）
  const { code, token, type } = searchParams;

  // codeパラメータがある場合は、Supabaseの認証フローを処理
  if (code) {
    console.log("Processing auth code:", code);
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Code exchange error:", error);
        // エラーの種類に応じて適切なメッセージを表示
        let errorMessage: string;
        if (
          error.message.includes("Invalid") ||
          error.message.includes("expired")
        ) {
          errorMessage = "リセットリンクが無効または期限切れです";
        } else if (
          error.message.includes("Network") ||
          error.message.includes("timeout")
        ) {
          errorMessage =
            "ネットワークエラーが発生しました。しばらく待ってから再試行してください";
        } else {
          errorMessage = "認証コードの処理に失敗しました";
        }
        return redirect(
          `/auth/reset-password?message=${encodeURIComponent(errorMessage)}`
        );
      }

      // 認証コード処理成功後、パスワード設定フォームを表示
      // この場合は、フォームを表示してパスワード更新を許可する
      console.log("Code exchange successful, showing password form");
    } catch (error) {
      console.error("Unexpected error during code exchange:", error);
      let errorMessage: string;
      if (error instanceof Error) {
        if (
          error.message.includes("Network") ||
          error.message.includes("timeout")
        ) {
          errorMessage =
            "ネットワークエラーが発生しました。しばらく待ってから再試行してください";
        } else {
          errorMessage = "認証処理中にエラーが発生しました";
        }
      } else {
        errorMessage = "認証処理中にエラーが発生しました";
      }
      return redirect(
        `/auth/reset-password?message=${encodeURIComponent(errorMessage)}`
      );
    }
  }

  // 従来のtoken/typeフロー（codeパラメータがない場合のみ）
  if (!code && (!token || type !== "recovery")) {
    console.log("Invalid token or type:", { token, type });
    return redirect("/auth/reset-password");
  }

  // トークンの有効性をチェック（token/typeフローの場合のみ）
  if (token && (!token || token.length < 10)) {
    console.log("Token too short:", token);
    return redirect("/auth/reset-password");
  }

  // トークンに無効な文字が含まれていないかチェック（token/typeフローの場合のみ）
  if (
    token &&
    (token.includes("\n") || token.includes("\r") || token.includes("\t"))
  ) {
    console.log("Token contains invalid characters:", token);
    return redirect("/auth/reset-password");
  }

  console.log("Validation passed, showing password form");

  const updatePassword = async (formData: FormData) => {
    "use server";

    try {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      const supabase = createSupabaseServerClient();

      // バリデーション
      if (!password || !confirmPassword) {
        const message = encodeURIComponent(
          "パスワードとパスワード確認を入力してください"
        );
        if (token && type) {
          const safeToken = encodeURIComponent(token);
          const safeType = encodeURIComponent(type);
          return redirect(
            `/auth/reset-password/confirm?message=${message}&token=${safeToken}&type=${safeType}`
          );
        }
        return redirect(`/auth/reset-password/confirm?message=${message}`);
      }

      if (password !== confirmPassword) {
        const message = encodeURIComponent("パスワードが一致しません");
        if (token && type) {
          const safeToken = encodeURIComponent(token);
          const safeType = encodeURIComponent(type);
          return redirect(
            `/auth/reset-password/confirm?message=${message}&token=${safeToken}&type=${safeType}`
          );
        }
        return redirect(`/auth/reset-password/confirm?message=${message}`);
      }

      if (password.length < 8) {
        const message = encodeURIComponent(
          "パスワードは8文字以上である必要があります"
        );
        if (token && type) {
          const safeToken = encodeURIComponent(token);
          const safeType = encodeURIComponent(type);
          return redirect(
            `/auth/reset-password/confirm?message=${message}&token=${safeToken}&type=${safeType}`
          );
        }
        return redirect(`/auth/reset-password/confirm?message=${message}`);
      }

      // パスワードの強度チェック
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(password)) {
        const message = encodeURIComponent(
          "パスワードは小文字、大文字、数字を含む必要があります"
        );
        if (token && type) {
          const safeToken = encodeURIComponent(token);
          const safeType = encodeURIComponent(type);
          return redirect(
            `/auth/reset-password/confirm?message=${message}&token=${safeToken}&type=${safeType}`
          );
        }
        return redirect(`/auth/reset-password/confirm?message=${message}`);
      }

      console.log("Attempting to update password");

      // パスワード更新
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Update password error:", error);
        const message = encodeURIComponent(error.message);
        if (token && type) {
          const safeToken = encodeURIComponent(token);
          const safeType = encodeURIComponent(type);
          return redirect(
            `/auth/reset-password/confirm?message=${message}&token=${safeToken}&type=${safeType}`
          );
        }
        return redirect(`/auth/reset-password/confirm?message=${message}`);
      }

      console.log("Password updated successfully");
      return redirect("/auth/reset-password/success");
    } catch (error) {
      console.error("Unexpected error during password update:", error);

      // エラーの種類に応じて適切なメッセージを表示
      let message: string;
      if (error instanceof Error) {
        // 既知のエラーの場合は、そのメッセージを使用
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("Invalid token") ||
          error.message.includes("Token expired")
        ) {
          message = "リセットリンクが無効または期限切れです";
        } else if (
          error.message.includes("Network") ||
          error.message.includes("timeout")
        ) {
          message =
            "ネットワークエラーが発生しました。しばらく待ってから再試行してください";
        } else {
          message = "パスワード更新中にエラーが発生しました";
        }
      } else {
        message = "予期しないエラーが発生しました";
      }

      const encodedMessage = encodeURIComponent(message);
      if (token && type) {
        const safeToken = encodeURIComponent(token);
        const safeType = encodeURIComponent(type);
        return redirect(
          `/auth/reset-password/confirm?message=${encodedMessage}&token=${safeToken}&type=${safeType}`
        );
      }
      return redirect(`/auth/reset-password/confirm?message=${encodedMessage}`);
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

          <div className="text-gray-500 mb-4 text-xs">
            <p>パスワードは以下の条件を満たす必要があります：</p>
            <ul className="list-disc pl-4">
              <li>8文字以上</li>
              <li>小文字を含む</li>
              <li>大文字を含む</li>
              <li>数字を含む</li>
            </ul>
          </div>

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
            {decodeURIComponent(searchParams.message)}
          </p>
        )}
      </div>
    </div>
  );
}
