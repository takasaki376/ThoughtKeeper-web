"use client";
import { NumberInput } from "@mantine/core";
import { useAtom } from "jotai";
import ky from "ky";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import { useUser } from "@/hooks/useUser";
import { countTheme, countTime } from "@/store/setting";

export default function SettingPage() {
  const { user } = useUser();
  const [count, setCount] = useAtom(countTheme);
  const [time, setTime] = useAtom(countTime);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await ky.get("/api/settings").json<{
          theme_count: number;
          time_limit: string;
        }>();
        if (data) {
          setCount(data.theme_count || 10);
          setTime(data.time_limit || "60");
        }
      } catch (error) {
        console.error("設定の取得に失敗しました:", error);
      }
    };

    if (user) {
      fetchSettings();
    }
  }, [user, setCount, setTime]);

  if (!user) {
    return null;
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
        ky.put("/api/settings", {
          json: { theme_count: localCount },
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
        ky.put("/api/settings", {
          json: { time_limit: localTime },
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
