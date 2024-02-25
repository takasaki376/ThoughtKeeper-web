"use client";

import { usePathname } from "next/navigation";

const MemoViewerIndividualPage = () => {
  const pathname = usePathname();
  const memoTitle = pathname?.replace("/MemoViewer/", "");
  return (
    <div className="flex justify-center pt-6 text-gray">
      {memoTitle}: ＜＜＜ここにメモを表示させたい＞＞＞
    </div>
  );
};

export default MemoViewerIndividualPage;
