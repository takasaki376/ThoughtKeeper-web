"use client";
import { useSetAtom } from "jotai"; // jotaiのuseSetAtomをインポート
import { useRouter } from "next/navigation"; // useRouterをインポート

import { Loader } from "@/component/Loader";
import { useGetThemes } from "@/hooks/useGetThemes";
import { setThemeAtom } from "@/store/setting";

export default function ThemeSelectPage() {
  const ThemesToScribble = 10;
  const { error, loading, themes } = useGetThemes();
  const setThemes = useSetAtom(setThemeAtom);
  const router = useRouter(); // useRouterを使用してルーターを取得

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

  // スタートボタンをクリックしたときにメモ入力画面へ遷移
  const handleStart = () => {
    router.push("/MemoEditor"); // 遷移先のパスに応じて修正
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
              <p className="text-right">【{item.title}】</p>{" "}
              <p className="col-span-2">{item.theme}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex justify-center">
        <button
          className="flex justify-center rounded border bg-yellow-700 px-4 py-2 font-bold text-white shadow hover:bg-yellow-500 focus:outline-none"
          onClick={handleStart} // ボタンをクリックしたときにページ遷移
        >
          スタート
        </button>
      </div>
    </div>
  );
}
