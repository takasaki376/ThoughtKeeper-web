"use client";
import { NumberInput } from "@mantine/core";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import { countTheme, countTime } from "@/store/setting";

export default function SettingPage() {
  const [count, setCount] = useAtom(countTheme);
  const [time, setTime] = useAtom(countTime);

  useEffect(() => {
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
    fetchSettings();
  }, [setCount, setTime]);

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
        </form>
      </div>
      <Link className="pl-10 text-xl" href="/">
        <MdOutlineClose />
      </Link>
    </div>
  );
}
