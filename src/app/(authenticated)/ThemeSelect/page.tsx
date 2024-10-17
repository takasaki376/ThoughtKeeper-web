"use client";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Loader } from "@/component/Loader";
import { useGetThemes } from "@/hooks/useGetThemes";
import { setThemeAtom } from "@/store/setting";

interface Theme {
  id: string;
  title: string;
  theme: string;
}

export default function ThemeSelectPage() {
  const ThemesToScribble = 10;
  const { error, loading, themes } = useGetThemes();
  const setThemes = useSetAtom(setThemeAtom); // jotaiのsetThemeAtomを使用
  const router = useRouter();
  const [selected, setSelected] = useState<Theme[]>([]); // 型をTheme[]に指定

  useEffect(() => {
    if (themes.length > 0) {
      const selectedThemes = randomSelect(themes.slice(), ThemesToScribble);
      setSelected(selectedThemes); // 型が一致しているためエラーが解消される
    }
  }, [themes]);

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
    const newTheme = [];
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
          className="rounded border bg-yellow-700 px-4 py-2 font-bold text-white shadow hover:bg-yellow-500"
          onClick={handleStart}
        >
          スタート
        </button>
      </div>
    </div>
  );
}
