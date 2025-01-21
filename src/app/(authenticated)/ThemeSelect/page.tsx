"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Loader } from "@/component/Loader";
import { useGetThemes } from "@/hooks/useGetThemes";
import { countTheme, setThemeAtom } from "@/store/setting";
import type { Theme } from "@/types/database";



export default function ThemeSelectPage() {
  const ThemesToScribble = useAtomValue(countTheme); // 設定されたテーマ数を取得
  const { error, loading, themes } = useGetThemes();
  const setThemes = useSetAtom(setThemeAtom);
  const router = useRouter();
  const [selected, setSelected] = useState<Theme[]>([]);

  useEffect(() => {
    if (themes.length > 0) {
      const selectedThemes = randomSelect(themes.slice(), ThemesToScribble);
      setSelected(selectedThemes);
    }
  }, [themes, ThemesToScribble]);

  useEffect(() => {
    if (selected.length > 0) {
      setThemes(selected);
    }
  }, [selected, setThemes]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  function randomSelect(theme: Theme[], num: number): Theme[] {
    const newTheme: Theme[] = [];
    while (newTheme.length < num && theme.length > 0) {
      const rand = Math.floor(Math.random() * theme.length);
      newTheme.push(theme[rand]);
      theme.splice(rand, 1);
    }
    return newTheme;
  }

  const handleStart = () => {
    router.push("/MemoEditor");
  };
  return (
    <div className="">
      <div className="my-3 flex justify-around">
        <p>今日のテーマ</p>
        <p>テーマ数：{ThemesToScribble}</p>
      </div>
      <ul className="p-3">
        {selected.map((item) => {
          return (
            <li key={item.id} className="grid grid-cols-3 gap-3">
              <p className="text-right">【{item.title}】</p>
              <p className="col-span-2">{item.theme}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="rounded border bg-yellow-700 px-4 py-2 font-bold text-white shadow hover:bg-yellow-500"
          onClick={handleStart}
        >
          スタート
        </button>
      </div>
    </div>
  );
}
