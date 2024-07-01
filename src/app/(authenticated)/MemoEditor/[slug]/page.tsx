"use client";
import { usePathname } from "next/navigation";

import { Tiptap } from "@/component/TipTap";

export default async function MemoEditorIndividualPage() {
  const pathname = usePathname();
  if (pathname === null) {
    throw new Error("this path must not be reached");
  }
  const replacedText = pathname.replace("/MemoEditor/", "");

  const decodedTheme = decodeURI(replacedText);

  return (
    <>
      <div className="flex justify-center pt-5">テーマ：{decodedTheme}</div>
      <Tiptap />;
    </>
  );
}
