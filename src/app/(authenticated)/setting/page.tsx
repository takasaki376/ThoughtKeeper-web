"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { ChangeEvent } from "react";
import { MdOutlineClose } from "react-icons/md";

import { countTheme, countTime } from "@/store/setting";

export default function SettingPage() {
  // テーマ数の入力
  const InputTargetCount = () => {
    const [count, setCount] = useAtom(countTheme);
    const onCountChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!isNaN(Number(value))) {
        setCount(Number(value)); // 数値として保存
      }
    };

    return (
      <input
        placeholder="テーマの数を入力してください"
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={count}
        onChange={onCountChange}
      />
    );
  };

  // 制限時間の入力
  const InputTargetTime = () => {
    const [time, setTime] = useAtom(countTime);
    const onTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!isNaN(Number(value))) {
        setTime(value); // 文字列として保存
      }
    };

    return (
      <input
        placeholder="テーマに対する入力時間を指定してください"
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={time}
        onChange={onTimeChange}
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
