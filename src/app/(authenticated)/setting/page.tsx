"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import NumericInput from "react-numeric-input";

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
    const onChange = async (valueAsNumber: number | null) => {
      if (valueAsNumber !== null) {
        setCount(valueAsNumber);
        const response = await fetch("/api/settings", {
          body: JSON.stringify({
            theme_count: valueAsNumber,
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
      <NumericInput min={1} max={100} value={count} onChange={onChange} style />
    );
  };

  // 制限時間の入力
  const InputTargetTime = () => {
    const onTimeChange = async (valueAsNumber: number | null) => {
      if (valueAsNumber !== null) {
        setTime(String(valueAsNumber));
        const response = await fetch("/api/settings", {
          body: JSON.stringify({
            theme_count: count,
            time_limit: String(valueAsNumber),
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
      <NumericInput
        min={1}
        max={3600}
        value={Number(time)}
        onChange={onTimeChange}
        style
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
              <InputTargetCount />
              &nbsp;件
              <p className="py-2 text-sm text-gray">テーマの数を設定します</p>
            </div>
          </div>

          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label className="mb-3 block pr-4 font-bold">入力する時間</label>
            </div>
            <div className="md:w-2/3">
              <InputTargetTime />
              &nbsp;秒
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
