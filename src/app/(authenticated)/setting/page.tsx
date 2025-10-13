"use client";
import { NumberInput } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import { Loader } from "@/component/Loader";
import { useSettings } from "@/hooks/useSettings";

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
  const { error, isLoading, settings, updateSettings } = useSettings();

  if (isLoading) return <Loader />;
  if (error) return <div>エラーが発生しました: {error.message}</div>;

  const themeCount = settings?.theme_count ?? 10;
  const timeLimit = settings?.time_limit ?? "60";

  return (
    <div className="mx-3 mt-6 flex justify-between p-8 shadow lg:mt-0 dark:shadow-lightGray">
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
      </div>
      <Link className="pl-10 text-xl" href="/">
        <MdOutlineClose />
      </Link>
    </div>
  );
}
