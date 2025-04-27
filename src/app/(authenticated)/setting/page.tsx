"use client";
import { NumberInput } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import { updateSettings } from "@/app/actions/settings";
import { createSupabaseServerClient } from "@/utils/supabase/server";

// クライアントコンポーネント
const ThemeCountInput = ({
  initialValue,
  onUpdate,
}: {
  initialValue: number;
  onUpdate: (value: number) => Promise<void>;
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = async (val: number | string) => {
    const newValue = Number(val);
    setValue(newValue);
    await onUpdate(newValue);
  };

  return (
    <NumberInput
      id="themeCount"
      value={value}
      onChange={handleChange}
      min={1}
      max={100}
      clampBehavior="strict"
      allowDecimal={false}
    />
  );
};

const TimeLimitInput = ({
  initialValue,
  onUpdate,
}: {
  initialValue: string;
  onUpdate: (value: string) => Promise<void>;
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = async (val: number | string) => {
    const newValue = String(val);
    setValue(newValue);
    await onUpdate(newValue);
  };

  return (
    <NumberInput
      min={1}
      max={3600}
      value={Number(value)}
      onChange={handleChange}
      clampBehavior="strict"
      allowDecimal={false}
    />
  );
};

// サーバーコンポーネント
export default async function SettingPage() {
  const supabase = createSupabaseServerClient();

  // サーバーサイドでの直接データフェッチ
  const { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .single();

  const handleThemeCountUpdate = async (value: number) => {
    await updateSettings({
      theme_count: value,
      time_limit: settings?.time_limit || "60",
    });
  };

  const handleTimeLimitUpdate = async (value: string) => {
    await updateSettings({
      theme_count: settings?.theme_count || 10,
      time_limit: value,
    });
  };

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
                <ThemeCountInput
                  initialValue={settings?.theme_count || 10}
                  onUpdate={handleThemeCountUpdate}
                />
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
                <TimeLimitInput
                  initialValue={settings?.time_limit || "60"}
                  onUpdate={handleTimeLimitUpdate}
                />
                &nbsp;秒
              </div>
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
