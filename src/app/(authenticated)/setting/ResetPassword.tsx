"use client";
import { useCallback, useEffect, useState } from "react";

import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";

import { passwordRequirements } from "./passwordRequirements";

interface UserSettings {
  theme_count: number;
  time_limit: string;
  user_id: string;
}

export default function ResetPassword() {
  const { user } = useUser();
  const supabase = createClient();
  const [userSettings, setUserSettings] = useState<UserSettings[] | null>(null);

  if (!user) {
    console.error("User is not authenticated");
  }

  // パスワードリセットの入力
  const InputResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");

    const handleChange = (val: string) => {
      setNewPassword(val);
    };

    const handleReset = async (e: React.FormEvent) => {
      e.preventDefault();
      // パスワードの検証
      if (newPassword.length < 8) {
        alert("パスワードは8文字以上である必要があります。");
        return;
      }

      // 文字種の要件チェック
      const hasNumber = /\d/.test(newPassword);
      const hasLower = /[a-z]/.test(newPassword);
      const hasUpper = /[A-Z]/.test(newPassword);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

      if (!(hasNumber && hasLower && hasUpper && hasSymbol)) {
        alert(
          "パスワードには数字、小文字、大文字、記号を含める必要があります。"
        );
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            console.error("パスワードの更新に失敗しました:", error.message);
            alert("パスワードの更新に失敗しました。");
          } else {
            alert("パスワードが更新されました。");
            setNewPassword("");
            // サインイン処理を削除（セッションは維持されます）
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました";

        console.error(
          "パスワードリセット中にエラーが発生しました:",
          errorMessage
        );
        alert(errorMessage);
      }
    };

    return (
      <div>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="新しいパスワード"
          className="border p-2"
        />
        <button
          type="submit"
          onClick={handleReset}
          className="ml-2 bg-blue-500 p-2 text-white"
        >
          パスワードリセット
        </button>
      </div>
    );
  };

  const fetchUserSettings = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.error("設定の取得エラー:", error.message);
        return null;
      }
      setUserSettings(data);
    },
    [supabase]
  );

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        fetchUserSettings(session.user.id);
      }
    };

    fetchSession();
  }, [supabase, fetchUserSettings]);

  return (
    <div className="mb-6 md:flex">
      <div className="md:w-1/3">
        <label htmlFor="resetPassword" className="mb-3 block pr-4 font-bold">
          パスワードリセット
        </label>
      </div>
      <div className="md:w-2/3">
        <span className="mb-3 block pr-4 text-xs">email: {user?.email}</span>
        <InputResetPassword />
        <p className="py-2 text-sm text-gray">{passwordRequirements}</p>
        {userSettings && (
          <div>
            <h3>ユーザー設定</h3>
            <pre>{JSON.stringify(userSettings, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
