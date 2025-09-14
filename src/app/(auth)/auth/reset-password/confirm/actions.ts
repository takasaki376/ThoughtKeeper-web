"use server";

import type { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function updatePassword(
  formData: FormData,
  code?: string | null,
  token?: string | null,
  type?: string | null
) {
  console.log("=== Password Update Process Started ===");
  console.log("Input parameters:", { code, token, type });

  try {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log("Form data received:", {
      confirmPasswordLength: confirmPassword?.length || 0,
      passwordLength: password?.length || 0,
      passwordsMatch: password === confirmPassword
    });

    const supabase = createSupabaseServerClient();
    console.log("Supabase client created");

    // バリデーション
    if (!password || !confirmPassword) {
      console.log("Validation failed: Missing password or confirmPassword");
      const message = "パスワードとパスワード確認を入力してください";
      if (code) {
        const safeCode = encodeURIComponent(code);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&code=${safeCode}`);
      }
      if (token && type) {
        const safeToken = encodeURIComponent(token);
        const safeType = encodeURIComponent(type);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&token=${safeToken}&type=${safeType}`);
      }
      redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}`);
    }

    if (password !== confirmPassword) {
      console.log("Validation failed: Passwords do not match");
      const message = "パスワードが一致しません";
      if (code) {
        const safeCode = encodeURIComponent(code);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&code=${safeCode}`);
      }
      if (token && type) {
        const safeToken = encodeURIComponent(token);
        const safeType = encodeURIComponent(type);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&token=${safeToken}&type=${safeType}`);
      }
      redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}`);
    }

    if (password.length < 8) {
      console.log("Validation failed: Password too short");
      const message = "パスワードは8文字以上である必要があります";
      if (code) {
        const safeCode = encodeURIComponent(code);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&code=${safeCode}`);
      }
      if (token && type) {
        const safeToken = encodeURIComponent(token);
        const safeType = encodeURIComponent(type);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&token=${safeToken}&type=${safeType}`);
      }
      redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}`);
    }

    // パスワードの強度チェック
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      console.log("Validation failed: Password does not meet strength requirements");
      const message = "パスワードは小文字、大文字、数字を含む必要があります";
      if (code) {
        const safeCode = encodeURIComponent(code);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&code=${safeCode}`);
      }
      if (token && type) {
        const safeToken = encodeURIComponent(token);
        const safeType = encodeURIComponent(type);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&token=${safeToken}&type=${safeType}`);
      }
      redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}`);
    }

    console.log("All validations passed, proceeding with password update");

    // パスワード更新
    let error: AuthError | null = null;
    if (code) {
      // codeパラメータがある場合は、認証コードを使ってパスワードを更新
      console.log("=== Using CODE flow for password update ===");

      // 認証コードを使ってセッションを確立
      console.log("Exchanging code for session...");
      const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
      if (codeError) {
        console.error("Code exchange error:", codeError);
        const message = `認証コードの処理に失敗しました: ${codeError.message}`;
        const safeCode = encodeURIComponent(code);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&code=${safeCode}`);
      }

      // 現在のセッション状態を確認
      console.log("Checking current session...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("Session check result:", {
        hasSession: !!session,
        sessionError: sessionError?.message || "none",
        userId: session?.user?.id || "none"
      });

      if (sessionError) {
        console.error("Session error:", sessionError);
      }

      // ユーザー情報を確認
      console.log("Checking current user...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log("User check result:", {
        hasUser: !!user,
        userEmail: user?.email || "none",
        userError: userError?.message || "none",
        userId: user?.id || "none"
      });

      if (userError) {
        console.error("User error:", userError);
      }

      console.log("Attempting to update user password...");
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      error = updateError;
      console.log("Update result:", {
        error: updateError?.message || "none",
        errorName: updateError?.name || "none",
        success: !updateError
      });
    } else {
      // 従来のtoken/typeフローの場合
      console.log("=== Using TOKEN/TYPE flow for password update ===");
      console.log("Attempting to update user password with token...");
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      error = updateError;
      console.log("Update result:", {
        error: updateError?.message || "none",
        errorName: updateError?.name || "none",
        success: !updateError
      });
    }

    if (error) {
      console.error("=== Password Update Failed ===");
      console.error("Update password error:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        status: error.status
      });

      // エラーの種類に応じて適切なメッセージを表示
      let message: string;
      if (error.message.includes("same password") || error.message.includes("identical")) {
        message = "古いパスワードと同じです。別のパスワードを設定してください。";
      } else if (error.message.includes("Invalid login credentials") ||
                 error.message.includes("Invalid token") ||
                 error.message.includes("Token expired") ||
                 error.message.includes("expired")) {
        message = "リセットリンクが無効または期限切れです";
      } else if (error.message.includes("Network") ||
                 error.message.includes("timeout") ||
                 error.message.includes("connection")) {
        message = "ネットワークエラーが発生しました。しばらく待ってから再試行してください";
      } else if (error.message.includes("rate limit") ||
                 error.message.includes("too many")) {
        message = "リクエストが多すぎます。しばらく待ってから再試行してください";
      } else if (error.message.includes("weak password") ||
                 error.message.includes("password strength")) {
        message = "パスワードが弱すぎます。より強力なパスワードを設定してください";
      } else {
        // 詳細なエラー情報を含める
        message = `パスワード更新中にエラーが発生しました: ${error.message}`;
      }

      console.log("Redirecting with error message:", message);
      if (code) {
        const safeCode = encodeURIComponent(code);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&code=${safeCode}`);
      }
      if (token && type) {
        const safeToken = encodeURIComponent(token);
        const safeType = encodeURIComponent(type);
        redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&token=${safeToken}&type=${safeType}`);
      }
      redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}`);
    }

    console.log("=== Password Update Successful ===");
    // パスワード更新成功後、ログインページに遷移
    redirect("/auth/login?message=パスワードが正常に更新されました。新しいパスワードでログインしてください。");
  } catch (error) {
    console.error("=== Unexpected Error During Password Update ===");
    console.error("Unexpected error during password update:", error);
    console.error("Unexpected error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

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
      } else if (error.message.includes("same password") ||
                 error.message.includes("identical")) {
        message = "古いパスワードと同じです。別のパスワードを設定してください。";
      } else {
        message = `パスワード更新中にエラーが発生しました: ${error.message}`;
      }
    } else {
      message = "予期しないエラーが発生しました";
    }

    console.log("Redirecting with unexpected error message:", message);
    if (code) {
      // codeパラメータがある場合は、codeパラメータを保持してリダイレクト
      const safeCode = encodeURIComponent(code);
      redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&code=${safeCode}`);
    }
    if (token && type) {
      const safeToken = encodeURIComponent(token);
      const safeType = encodeURIComponent(type);
      redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}&token=${safeToken}&type=${safeType}`);
    }
    redirect(`/auth/reset-password/confirm?message=${encodeURIComponent(message)}`);
  }
}
