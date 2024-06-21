"use client";
import { type ChangeEvent, useState } from "react";


export default function SettingPage() {
  const [value, setValue] = useState("");
  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  return (
    <div id="section2" className="mt-6 rounded bg-white p-8 lg:mt-0">
      <form>
        <div className="mb-6 md:flex">
          <div className="md:w-1/3">
            <label className="mb-3 block pr-4 font-bold  md:mb-0 md:text-left">
              テーマの件数
            </label>
          </div>
          <div className="md:w-2/3">
            <div className="flex items-center">
              <select
                name=""
                className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
                id="my-select"
              >
                <option value="Default">10</option>
                <option value="A">20</option>
                <option value="B">30</option>
                <option value="C">その他</option>
              </select>
              件
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
              <select
                name=""
                className="mr-2 block w-full bg-lightGray p-1 focus:bg-white"
                id="my-select"
              >
                <option value="Default">60</option>
                <option value="A">90</option>
                <option value="B">120</option>
                <option value="C">その他</option>
              </select>
              秒
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
  );
}
