"use client";
import { NumberInput } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import { SubmitButton } from "@/app/(auth)/auth/login/submit-button";
import { Loader } from "@/component/Loader";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { useSettings } from "@/hooks/useSettings";
import { useUser } from "@/hooks/useUser";

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
  const {
    updatePassword,
    isLoading: isPasswordUpdating,
    error: passwordError,
    success: passwordSuccess,
  } = usePasswordReset();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [showPasswordMatchMessage, setShowPasswordMatchMessage] =
    useState(false);

  // リアルタイムバリデーション
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatchMessage("パスワードが一致しません");
      setShowPasswordMatchMessage(true);
    } else if (confirmPassword && password === confirmPassword) {
      setPasswordMatchMessage("パスワードが一致しました✅");
      setShowPasswordMatchMessage(true);
    } else {
      setShowPasswordMatchMessage(false);
    }
  }, [password, confirmPassword]);

  const handlePasswordUpdate = async () => {
    if (!password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    await updatePassword(password, confirmPassword);
  };

  // パスワード更新成功時にフォームをクリア
  useEffect(() => {
    if (passwordSuccess) {
      setPassword("");
      setConfirmPassword("");
    }
  }, [passwordSuccess]);

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

        {/* パスワード変更セクション */}
        <div className="mt-10">
          <h2 className="mb-6 text-xl font-bold">パスワードの変更</h2>
          <p className="text-gray-600 mb-6 text-sm">
            現在ログイン中のアカウント（{user?.email}
            ）のパスワードを直接変更できます。
          </p>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordUpdate();
            }}
          >
            <label className="text-base font-semibold" htmlFor="newPassword">
              新しいパスワード
            </label>
            <input
              className="mb-4 rounded-md border bg-inherit px-4 py-2"
              type="password"
              name="newPassword"
              id="newPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              disabled={isPasswordUpdating}
            />

            <label
              className="text-base font-semibold"
              htmlFor="confirmNewPassword"
            >
              パスワード確認
            </label>
            <input
              className="mb-4 rounded-md border bg-inherit px-4 py-2"
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              disabled={isPasswordUpdating}
            />

            {/* リアルタイムバリデーションメッセージ */}
            {showPasswordMatchMessage && (
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

            <button
              type="submit"
              className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground disabled:opacity-50"
              disabled={
                isPasswordUpdating ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
            >
              {isPasswordUpdating ? "更新中..." : "パスワードを変更"}
            </button>
          </form>

          {passwordSuccess && (
            <p className="mt-4 rounded border border-green-200 bg-green-50 p-4 text-center text-green-600">
              {passwordSuccess}
            </p>
          )}

          {passwordError && (
            <p className="mt-4 rounded border border-red-200 bg-red-50 p-4 text-center text-tomato">
              {passwordError}
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
