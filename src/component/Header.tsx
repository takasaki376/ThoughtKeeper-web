"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdLogout, MdOutlineSettings } from 'react-icons/md';

export const Header = () => {
  //ユーザーアイコンの挙動はこんな感じ？
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handlePopOverOpen = () => setIsPopoverOpen(!isPopoverOpen);
  // path名の判定（/settingの時）でボタンを非アクティブ
  const pathname = usePathname();
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
            <FaRegCircleUser />
          </button>
          <ul
            className={`absolute right-0 top-7 z-10 rounded bg-white px-3 py-2 shadow drop-shadow ${
              isPopoverOpen ? "block" : "hidden"
            }`}
          >
            <MdLogout />
          </ul>
        </div>
        <div className="text-2xl">
          {pathname === "/setting" ? (
            <span className="text-gray">
              <MdOutlineSettings />
            </span>
          ) : (
            <Link href="/setting">
              <MdOutlineSettings />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
