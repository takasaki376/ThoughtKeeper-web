"use client";
import { useSetAtom } from "jotai"; // jotaiのuseSetAtomをインポート

import { Loader } from "@/component/Loader";
import { useGetThemes } from "@/hooks/useGetThemes";
import { setThemeAtom } from "@/store/setting"; // setThemeAtomをインポート

export default function ThemeSelectPage() {
  const ThemesToScribble = 10;
  const { error, loading, themes } = useGetThemes();
  const setThemes = useSetAtom(setThemeAtom); // setThemeAtomを使用

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const selected = randomSelect(themes.slice(), ThemesToScribble);

  // 選択されたテーマを保存
  setThemes(selected);

  function randomSelect(theme: any, num: number) {
    const newTheme = [];
    while (newTheme.length < num && theme.length > 0) {
      const rand = Math.floor(Math.random() * theme.length);
      newTheme.push(theme[rand]);
      theme.splice(rand, 1);
    }
    return newTheme;
  }

  return (
    <div className="">
      <div className="my-3 flex justify-around">
        <p>今日のテーマ</p>
        <p>テーマ数：{ThemesToScribble}</p>
      </div>
      <ul className="mx-auto w-full flex-col items-center justify-center p-3">
        {selected.map((item) => {
          return (
            <li key={item.id}>
              【{item.title}】 {item.theme}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
