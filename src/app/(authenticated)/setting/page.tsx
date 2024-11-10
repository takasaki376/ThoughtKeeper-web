"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { ChangeEvent, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";

import { countTheme, countTime } from "@/store/setting";

export default function SettingPage() {
  const [count, setCount] = useAtom(countTheme);
  const [time, setTime] = useAtom(countTime);

  // 設定の取得
  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        console.error("Failed to fetch settings");
        return;
      }
      const data = await response.json();
      setCount(data.theme_count);
      setTime(data.time_limit);
    };

    fetchSettings();
  }, [setCount, setTime]);

  // テーマ数の入力
  const InputTargetCount = () => {
    const onCountChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!isNaN(Number(value))) {
        const updatedCount = Number(value);
        setCount(updatedCount);

        // APIを通じて更新
        const response = await fetch("/api/settings", {
          body: JSON.stringify({
            theme_count: updatedCount,
            time_limit: time,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PUT",
        });

        if (!response.ok) {
          console.error("Failed to update settings");
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

        // APIを通じて更新
        const response = await fetch("/api/settings", {
          body: JSON.stringify({
            theme_count: count,
            time_limit: updatedTime,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PUT",
        });

        if (!response.ok) {
          console.error("Failed to update settings");
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
