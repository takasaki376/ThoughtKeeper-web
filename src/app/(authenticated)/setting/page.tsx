"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { ChangeEvent } from "react";
import { MdOutlineClose } from "react-icons/md";

import { countTheme, countTime, initialText } from "@/store/setting";

export default function SettingPage() {
  const InputTargetCount = () => {
    const [count, setCount] = useAtom(countTheme);
    const onCountChange = (inputCount: ChangeEvent<HTMLInputElement>) => {
      const count = inputCount.target.value;
      const isNaN = Number.isNaN(count);
      if (isNaN) {
        return;
      } else {
        setCount(Number(count));
      }
    };

    return (
      <input
        placeholder="テーマの数を入力してください"
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={count}
        onChange={(e) => onCountChange(e)}
      />
    );
  };

  const InputTargetTime = () => {
    const [time, setTime] = useAtom(countTime);
    return (
      <input
        placeholder="テーマに対する入力時間を指定してください"
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
    );
  };
  const InputText = () => {
    const [text, setText] = useAtom(initialText);
    return (
      <textarea
        placeholder="テーマのデフォルト値"
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    );
  };

  return (
    <div
      id="section2"
      className="mx-3 mt-6 flex justify-between bg-white p-8 shadow lg:mt-0"
    >
      <div className="flex-1">
        <form>
          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label className="mb-3 block pr-4 font-bold  md:mb-0 md:text-left">
                テーマの件数
              </label>
            </div>
            <div className="md:w-2/3">
              <div className="flex items-center ">
                <InputTargetCount />件
              </div>

              <p className="py-2 text-sm text-gray">
                １日に記入するテーマの件数を設定します
              </p>
            </div>
          </div>

          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label className=" mb-3 block pr-4 font-bold md:mb-0 md:text-left">
                入力する時間
              </label>
            </div>
            <div className="md:w-2/3">
              <div className="flex items-center">
                <InputTargetTime />秒
              </div>
              <p className="py-2 text-sm text-gray">
                １つのテーマに対して、入力する時間を設定します
              </p>
            </div>
          </div>

          <div className="mb-6 md:flex">
            <div className="md:w-1/3">
              <label className="mb-3 block pr-4 font-bold  md:mb-0 md:text-left">
                テーマのデフォルト値
              </label>
            </div>
            <div className="md:w-2/3">
              <InputText />
              <p className="py-2 text-sm text-gray ">説明</p>
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
