import Link from "next/link";

import AuthButton from "@/app/auth/_button/AuthButton";

import { HeaderSettingButton } from "./HeaderSettingButton";

export const Header = () => {
  return (
    <header className="flex w-screen items-center justify-between bg-lightGray px-5 py-3">
      <Link href="/">
        <span className="text-lg font-semibold">Tought Keeper</span>
      </Link>
      <div className="flex w-20 justify-around">
        <div className="">
          <AuthButton />
        </div>
        <HeaderSettingButton />
      </div>
    </header>
  );
};
