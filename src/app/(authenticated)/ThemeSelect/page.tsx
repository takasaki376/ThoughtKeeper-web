"use client";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";

// import { useEffect } from "react";
import { Loader } from "@/component/Loader";
import { useGetThemes } from "@/hooks/useGetThemes";
import { countTheme } from "@/store/setting";

export default function ThemeSelectPage() {
  const ThemesToScribble = useAtomValue(countTheme); // 設定されたテーマ数を取得
  const { allThemes, error, loading, randomSelect } = useGetThemes();

  const router = useRouter();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const selected = randomSelect(allThemes, ThemesToScribble);

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
