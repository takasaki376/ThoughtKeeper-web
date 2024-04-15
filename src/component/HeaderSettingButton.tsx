"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineSettings } from "react-icons/md";

export const HeaderSettingButton = () => {
  // path名の判定（/settingの時）でボタンを非アクティブ
  const pathname = usePathname();
  return (
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
  );
};
