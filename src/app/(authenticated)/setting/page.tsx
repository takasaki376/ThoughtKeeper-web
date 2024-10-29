"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import { countTheme, countTime } from "@/store/setting";
import { supabase } from "@/utils/supabase/supabase";

export default function SettingPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [count, setCount] = useAtom(countTheme);
  const [time, setTime] = useAtom(countTime);

  // 認証ユーザーの取得
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to get user session:", error);
        return;
      }
      const user = data?.session?.user;
      if (user) {
        setUserId(user.id);
      }
    };

    getUser();
  }, []);

  // 設定の取得およびデフォルト値の設定
  useEffect(() => {
    if (!userId) return;

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("theme_count, time_limit")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Failed to fetch settings:", error);
        return;
      }

      if (data) {
        setCount(data.theme_count);
        setTime(data.time_limit);
      } else {
        // デフォルト設定がない場合は新規に挿入
        const defaultCount = 10;
        const defaultTime = "60";

        const { error: insertError } = await supabase
          .from("user_settings")
          .insert({
            theme_count: defaultCount,
            time_limit: defaultTime,
            user_id: userId,
          });

        if (insertError) {
          console.error("Failed to insert default settings:", insertError);
        } else {
          // 値を状態に反映
          setCount(defaultCount);
          setTime(defaultTime);
        }
      }
    };

    fetchSettings();
  }, [userId, setCount, setTime]);

  // テーマ数の入力
  const InputTargetCount = () => {
    const onCountChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!isNaN(Number(value))) {
        const updatedCount = Number(value);
        setCount(updatedCount);

        // DBに更新を反映
        if (userId) {
          const { error } = await supabase
            .from("user_settings")
            .upsert({ theme_count: updatedCount, user_id: userId });

          if (error) {
            console.error("Failed to update theme count:", error);
          }
        }
      }
    };

    return (
      <input
        placeholder="テーマの数を入力してください"
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={count}
        onChange={onCountChange}
        onBlur={onCountChange} // onBlurでの反映を追加
      />
    );
  };

  // 制限時間の入力
  const InputTargetTime = () => {
    const onTimeChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!isNaN(Number(value))) {
        const updatedTime = value;
        setTime(updatedTime);

        // DBに更新を反映
        if (userId) {
          const { error } = await supabase
            .from("user_settings")
            .upsert({ time_limit: String(updatedTime), user_id: userId });

          if (error) {
            console.error("Failed to update time limit:", error);
          }
        }
      }
    };

    return (
      <input
        placeholder="テーマに対する入力時間を指定してください"
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={time}
        onChange={onTimeChange}
        onBlur={onTimeChange} // フォーカスが外れたときに保存
      />
    );
  };

  return (
    <div className="mx-3 mt-6 flex justify-between bg-white p-8 shadow lg:mt-0">
      <div className="flex-1">
        <form>
          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label className="mb-3 block pr-4 font-bold">テーマの件数</label>
            </div>
            <div className="md:w-2/3">
              <InputTargetCount />件
              <p className="py-2 text-sm text-gray">テーマの数を設定します</p>
            </div>
          </div>

          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label className="mb-3 block pr-4 font-bold">入力する時間</label>
            </div>
            <div className="md:w-2/3">
              <InputTargetTime />秒
              <p className="py-2 text-sm text-gray">
                テーマごとの制限時間を設定します
              </p>
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
