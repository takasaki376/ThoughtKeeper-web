"use client";
import { NumberInput } from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAtom } from "jotai";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import { useUser } from "@/hooks/useUser";
import { countTheme, countTime } from "@/store/setting";

export default function SettingPage() {
  const { user } = useUser();
  const [count, setCount] = useAtom(countTheme);
  const [time, setTime] = useAtom(countTime);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data) {
        setCount(data.theme_count || 10);
        setTime(data.time_limit || "60");
      }
    } catch (error) {
      console.error("設定の取得に失敗しました:", error);
    }
  };

  // コンポーネントがマウントされたときに設定を取得
  fetchSettings();

  if (!user) {
    console.error("User is not authenticated");
  }

  // テーマ数の入力
  const InputTargetCount = () => {
    const [localCount, setLocalCount] = useState(count);

    const handleChange = (val: number | string) => {
      setLocalCount(Number(val));
    };

    const handleBlur = () => {
      if (localCount !== count) {
        setCount(localCount);
        fetch("/api/settings", {
          body: JSON.stringify({ theme_count: localCount }),
          headers: { "Content-Type": "application/json" },
          method: "PUT",
        });
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

  // 制限時間の入力
  const InputTargetTime = () => {
    const [localTime, setLocalTime] = useState(time);

    const handleChange = (val: number | string) => {
      setLocalTime(String(val));
    };

    const handleBlur = () => {
      if (localTime !== time) {
        setTime(localTime);
        fetch("/api/settings", {
          body: JSON.stringify({ time_limit: localTime }),
          headers: { "Content-Type": "application/json" },
          method: "PUT",
        });
      }
    };

    return (
      <NumberInput
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

  // パスワードリセットの入力
  const InputResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const supabase = createClientComponentClient();

    const handleChange = (val: string) => {
      setNewPassword(val);
    };

    const handleReset = async () => {
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
          const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            console.error("パスワードの更新に失敗しました:", error.message);
            alert("パスワードの更新に失敗しました。");
          } else {
            console.log("パスワードが更新されました:", data);
            alert("パスワードが更新されました。");
            setNewPassword("");
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
          type="button"
          onClick={handleReset}
          className="ml-2 bg-blue-500 p-2 text-white"
        >
          パスワードリセット
        </button>
      </div>
    );
  };

  // パスワードの要件を表示
  const passwordRequirements = (
    <div>
      <p>新しいパスワードの要件:</p>
      <ul>
        <li>最小文字数: 8文字以上</li>
        <li>使用文字の要件: 数字、小文字、大文字、記号を含めること</li>
        <li>漏洩パスワードは使用禁止</li>
      </ul>
    </div>
  );

  return (
    <div className="mx-3 mt-6 flex justify-between p-8 shadow lg:mt-0 dark:shadow-lightGray">
      <div className="flex-1">
        <form>
          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label htmlFor="themeCount" className="mb-3 block pr-4 font-bold">
                テーマの件数
              </label>
            </div>
            <div className="md:w-2/3">
              <div className="flex">
                <InputTargetCount />
                &nbsp;件
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
              <div className="flex">
                <InputTargetTime />
                &nbsp;秒
              </div>
              <p className="py-2 text-sm text-gray">
                テーマごとの制限時間を設定します
              </p>
            </div>
          </div>

          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label
                htmlFor="resetPassword"
                className="mb-3 block pr-4 font-bold"
              >
                パスワードリセット
              </label>
            </div>
            <div className="md:w-2/3">
              <span className="mb-3 block pr-4 text-xs">
                email: {user?.email}
              </span>
              <InputResetPassword />
              <p className="py-2 text-sm text-gray">{passwordRequirements}</p>
            </div>
          </div>
        </form>
      </div>
      <Link className="pl-10 text-xl" href="/">
        <MdOutlineClose />
      </Link>
    </div>
  );
}
