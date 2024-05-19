import Link from "next/link";

import { theme } from "@/mock/theme";

export default async function ThemeSelectPage() {

  const selected = randomSelect(theme.slice(), 10);

  // 配列themeからランダムにnum個の要素を取り出す
  function randomSelect(theme: any, num: number) {
    const newTheme = [];

    while (newTheme.length < num && theme.length > 0) {
      // 配列からランダムな要素を選ぶ
      const rand = Math.floor(Math.random() * theme.length);
      // 選んだ要素を別の配列に登録する
      newTheme.push(theme[rand]);
      // もとの配列からは削除する
      theme.splice(rand, 1);
    }

    return newTheme;
  }
  return (
    <div className="">
      <ul className="mx-auto w-full flex-col items-center justify-center p-3">
        {selected.map((item) => {
          return (
            <Link
              href="/MemoEditor"
              className="flex w-full items-center justify-center p-3"
              key={item.theme}
            >
              <li>
                【{item.title}】 {item.theme}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};
