import Link from "next/link";

import AuthButton from "@/app/(auth)/auth/_button/AuthButton";

import { HeaderSettingButton } from "./HeaderSettingButton";

export const Header = () => {
  return (
    <header className="flex w-screen items-center justify-between bg-lightGray/20 px-5 py-3">
      <Link href="/">
        <span className="text-lg font-semibold">Tought Keeper</span>
      </Link>
      <div className="flex w-20 justify-around">
        <div className="pt-1">
          <AuthButton />
        </div>
        <HeaderSettingButton />
      </div>
    </header>
  );
};
