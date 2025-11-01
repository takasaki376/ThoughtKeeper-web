"use client";
import { NumberInput } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import { SubmitButton } from "@/app/(auth)/auth/login/submit-button";
import { Loader } from "@/component/Loader";
import { useSettings } from "@/hooks/useSettings";
import { useUser } from "@/hooks/useUser";
import { sendPasswordResetEmail } from "@/services/authService";

// テーマ数の入力コンポーネント
const InputTargetCount = ({
  onUpdate,
  value,
}: {
  onUpdate: (count: number) => void;
  value: number;
}) => {
  const [localCount, setLocalCount] = useState(value);

  useEffect(() => {
    setLocalCount(value);
  }, [value]);

  const handleChange = (val: number | string) => {
    setLocalCount(Number(val));
  };

  const handleBlur = () => {
    if (localCount !== value) {
      onUpdate(localCount);
    }
  };

  return (
    <NumberInput
      id="themeCount"
      value={localCount}
      onChange={handleChange}
      onBlur={handleBlur}
      min={1}
      max={100}
      clampBehavior="strict"
      allowDecimal={false}
    />
  );
};

// 制限時間の入力コンポーネント
const InputTargetTime = ({
  onUpdate,
  value,
}: {
  onUpdate: (time: string) => void;
  value: string;
}) => {
  const [localTime, setLocalTime] = useState(value);

  useEffect(() => {
    setLocalTime(value);
  }, [value]);

  const handleChange = (val: number | string) => {
    setLocalTime(String(val));
  };

  const handleBlur = () => {
    if (localTime !== value) {
      onUpdate(localTime);
    }
  };

  return (
    <NumberInput
      id="timeLimit"
      min={1}
      max={3600}
      value={Number(localTime)}
      onChange={handleChange}
      onBlur={handleBlur}
      clampBehavior="strict"
      allowDecimal={false}
    />
  );
};

export default function SettingPage() {
  const {
    error: settingsError,
    isLoading: isSettingsLoading,
    settings,
    updateSettings,
  } = useSettings();
  const { user, isLoading: isUserLoading, error: userError } = useUser();

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const resetPassword = async () => {
    try {
      if (!user?.email) {
        setMessage({
          text: "ログインしているユーザーのメールアドレスが見つかりません",
          type: "error",
        });
        return;
      }
      const email = user.email;

      // バリデーション
      // メールアドレスの形式チェックは、user.emailがSupabaseから来ているので不要

      console.log("Attempting to send reset password email to:", email);

      const [success, msg] = await sendPasswordResetEmail(email);
      setMessage({ text: msg, type: success ? "success" : "error" });
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
      setMessage({ text: "予期しないエラーが発生しました。", type: "error" });
    }
  };

  if (isSettingsLoading || isUserLoading) {
    return <Loader />;
  }
  if (settingsError) {
    return <div>エラーが発生しました: {settingsError.message}</div>;
  }
  if (userError) {
    return (
      <div>ユーザー情報の取得中にエラーが発生しました: {userError.message}</div>
    );
  }

  const themeCount = settings?.theme_count ?? 10;
  const timeLimit = settings?.time_limit ?? "60";

  return (
    <div className="mx-3 mt-6 flex justify-between p-8 shadow dark:shadow-lightGray lg:mt-0">
      <div className="flex-1">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label htmlFor="themeCount" className="mb-3 block pr-4 font-bold">
                テーマの件数
              </label>
            </div>
            <div className="md:w-2/3">
              <div className="flex items-center">
                <InputTargetCount
                  value={themeCount}
                  onUpdate={(count) => updateSettings({ theme_count: count })}
                />
                <span className="ml-2">件</span>
              </div>
              <p className="py-2 text-sm text-gray">テーマの数を設定します</p>
            </div>
          </div>

          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label htmlFor="timeLimit" className="mb-3 block pr-4 font-bold">
                入力する時間
              </label>
            </div>
            <div className="md:w-2/3">
              <div className="flex items-center">
                <InputTargetTime
                  value={timeLimit}
                  onUpdate={(time) => updateSettings({ time_limit: time })}
                />
                <span className="ml-2">秒</span>
              </div>
              <p className="py-2 text-sm text-gray">
                テーマごとの制限時間を設定します
              </p>
            </div>
          </div>
        </form>

        {/* パスワードリセットセクション */}
        <div className="mt-10">
          <h2 className="mb-6 text-xl font-bold">パスワードの変更</h2>
          <p className="text-gray-600 mb-6 text-sm">
            現在ログイン中のメールアドレス（{user?.email}
            ）にパスワードリセット用のリンクをお送りします。
          </p>
          <form className="flex flex-col gap-2">
            <SubmitButton
              formAction={resetPassword}
              className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
              pendingText="送信中..."
            >
              リセットリンクを送信
            </SubmitButton>
          </form>

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
      <Link className="pl-10 text-xl" href="/">
        <MdOutlineClose />
      </Link>
    </div>
  );
}
