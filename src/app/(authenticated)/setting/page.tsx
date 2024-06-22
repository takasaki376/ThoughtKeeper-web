"use client";
import { atom, useAtom } from "jotai";
import { type ChangeEvent, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

export default function SettingPage() {
  const [value, setValue] = useState("");
  const countTheme = atom("10");
  const countTime = atom("60");
  const InputTargetCount = () => {
    const [count, setCount] = useAtom(countTheme);
    return (
      <input
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
    );
  };

  const InputTargetTime = () => {
    const [time, setTime] = useAtom(countTime);
    return (
      <input
        className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
    );
  };
  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
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
              <textarea
                className="block w-full bg-lightGray p-1 focus:bg-white"
                id="my-textarea"
                defaultValue={value}
                onChange={handleOnChange}
              ></textarea>
              <p className="py-2 text-sm text-gray ">説明</p>
            </div>
          </div>
        </form>
      </div>
      <div className="pl-10 text-xl">
        <MdOutlineClose />
      </div>
    </div>
  );
}
