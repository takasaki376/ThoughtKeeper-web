import Link from "next/link";
import { MdOutlineSettings } from "react-icons/md";

export const HeaderSettingButton = () => {
  // path名の判定（/settingの時）でボタンを非アクティブ
  return (
    <div className="text-2xl">
      <Link href="/setting">
        <MdOutlineSettings />
      </Link>
    </div>
  );
};
