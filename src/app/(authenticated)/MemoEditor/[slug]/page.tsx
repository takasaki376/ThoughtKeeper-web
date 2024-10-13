"use client";
import { useAtomValue } from "jotai"; // useAtomValueをインポート

import { Tiptap } from "@/component/TipTap";
import { themeAtom } from "@/store/setting"; // themeAtomをインポート

export default function MemoEditorIndividualPage() {
  const themes = useAtomValue(themeAtom); // themeAtomの値を取得

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-5">
        テーマ
        {themes.map((theme) => {
          return (
            <div className="flex flex-col" key={theme.id}>
              {theme.title}: {theme.theme}
            </div>
          );
        })}
      </div>
      <Tiptap />
    </>
  );
}
