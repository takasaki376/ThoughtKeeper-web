"use client";
import Link from "next/link";
import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";

import { HeaderSettingButton } from "./HeaderSettingButton";

export const Header = () => {
  //ユーザーアイコンの挙動はこんな感じ？
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handlePopOverOpen = () => setIsPopoverOpen(!isPopoverOpen);
  // path名の判定（/settingの時）でボタンを非アクティブ
  return (
    <header className="flex w-screen items-center justify-between bg-lightGray px-5 py-3">
      <Link href="/">
        <span className="text-lg font-semibold">Tought Keeper</span>
      </Link>
      <div className="flex w-20 justify-around">
        <div className="relative text-xl">
          <button
            aria-label="User Icon"
            type="button"
            onClick={handlePopOverOpen}
          >
            <Link href="/auth/login">
              <FaRegCircleUser />
            </Link>
          </button>
        </div>
        <HeaderSettingButton />
      </div>
    </header>
  );
};
