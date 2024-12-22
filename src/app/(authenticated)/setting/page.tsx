"use client";
import { NumberInput } from "@mantine/core";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";

import { fetchSettings } from "@/services/settingsService";
import {
  countTheme,
  countTime,
  setCountThemeAtom,
  setCountTimeAtom,
} from "@/store/setting";

export default function SettingPage() {
  const [count] = useAtom(countTheme);
  const [time] = useAtom(countTime);
  const [, setCount] = useAtom(setCountThemeAtom);
  const [, setTime] = useAtom(setCountTimeAtom);

  // 設定の取得
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const data = await fetchSettings();
        setCount(data.theme_count);
        setTime(data.time_limit);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSettingsData();
  }, [setCount, setTime]);

  // テーマ数の入力
  const InputTargetCount = () => {
    return (
      <NumberInput
        value={count}
        onChange={(val) => setCount(Number(val))}
        min={1}
        max={100}
        clampBehavior="strict"
        allowDecimal={false}
      />
    );
  };

  // 制限時間の入力
  const InputTargetTime = () => {
    return (
      <NumberInput
        min={1}
        max={3600}
        value={Number(time)}
        onChange={(val) => setTime(String(val))}
        clampBehavior="strict"
        allowDecimal={false}
      />
    );
  };

  return (
    <div className="mx-3 mt-6 flex justify-between p-8 shadow lg:mt-0 dark:shadow-lightGray">
      <div className="flex-1">
        <form>
          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label className="mb-3 block pr-4 font-bold">テーマの件数</label>
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
              <label className="mb-3 block pr-4 font-bold">入力する時間</label>
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
        </form>
      </div>
      <Link className="pl-10 text-xl" href="/">
        <MdOutlineClose />
      </Link>
    </div>
  );
}
